import os
import sys
import time
import json
import pymongo
import logging
import pathlib
import argparse
import requests
import cabutils
import configparser
import pandas as pd
logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.INFO)

parser = argparse.ArgumentParser()
parser.add_argument("--db", type=str, required=True, help="name of input db")
parser.add_argument("--col", type=str, required=True, help="name of experiment / col name")
parser.add_argument("--experiment_id", type=str, help="Prolific Experiment ID")
args = parser.parse_args()

settings = configparser.ConfigParser()
this_dir = pathlib.Path(__file__).parent.absolute()
settings_file = os.path.join(this_dir, "settings.conf")
settings.read(settings_file)

# Set up API token
PROLIFIC_API_KEY_PATH = settings['WATCHDOG']['PROLIFIC_API_KEY_PATH']
PROLIFIC_API_TOKEN = open(PROLIFIC_API_KEY_PATH, "r").read().rstrip("\n")
AUTH_HEADER = {"Authorization": f"Token {PROLIFIC_API_TOKEN}",
                "Content-Type": "application/json"}


# Get desired number of HITs per batch
HITS_PER_BATCH = int(settings["WATCHDOG"].get("HITS_PER_BATCH"))
SLEEP_TIME = settings["WATCHDOG"].get("SLEEP_TIME", 600)


"""
[DOCS]

To use the watchdog functionality, the most important
function to modify is the `calculate_batch_hits` function.
This is responsible for determining how many batches have
been adequately labeled, which will subsequently determine
how many additional subjects to launch.

This function is where you will potentially want to specify any
exclusion criteria to get rid of poor performers.
"""

def calculate_batch_hits(submissions, experiment_details):
    """ Calculates how many HITs each batch received
        Can be made to accomodate failures in attention trials
        poor responses, etc...

        Params:
        -------
        submissions: List of submission info from Prolific
                     Can be used to filter out participants
                     who didn't include a completion code,
                     or finished the study in a suspiciously
                     fast amount of time
        experiment_details: json response from Prolific that
                            contains experiment details. Useful
                            for things like average completion time,
                            expected completion time, etc...

        Returns:
        ---------
        List of ints specifying how many participants
        need to be run for each batch. The list is ordered
        by batch index
    """

    inputs = get_batch_inputs()
    logging.info(inputs.info())
    logging.info(inputs["batch"])
    batch_hits = [0 for i in range(len(inputs))]
    experiment_results = get_experiment_results()

    # Aggregate by users. Sum batch IDs
    user_results = experiment_results.groupby("userID")
    for names, result in user_results:
        # simple exclusion criteria
        if len(result) < 100:
            continue

        # Should be replaced with check for batch index
        stimulus = result["stimulus"].iloc[0]
        i = 0
        while "ground_truth" in stimulus:
            i += 1
            stimulus = result["stimulus"].iloc[i]

        batch_idx = stimulus.split("scene=")[1]
        batch = int(batch_idx.split("/")[0])

        batch_hits[batch] += 1

    return batch_hits

def update_batch_hits(batch_hits):
    """ Updates records of how many times each batch has been completed """
    conn = cabutils.get_db_connection()
    db = conn[args.db + "_inputs"]
    col = db[args.col]
    for i, batch in enumerate(batch_hits):
        logging.info(f"Updating batch: {i} to numGames={batch}...")
        res = col.update_one({"batch": i}, {"$set": {"numGames": batch}})

    return

def prolific_get(url, params=None):
    resp = requests.get(url, headers=AUTH_HEADER, params=params)
    if resp:
        return resp.json()
    else:
        return None


def launch_experiment():
    """
    Experiment parameters should be a json file with the following fields:
        name: <study name>
        internal_name: <internal name>
        description: <external description>
        external_study_url: <study url>
        prolific_id_option: "url_parameters"
        completion_code: <completion code>
        completion_option: "url"
        total_available_places: <n_participants>
        estimated_completion_time: <estimated time>
        max_completion_time: <max time>
        reward: <amount to pay (documentation says in cents, but example looks like dollars)>
        device_compatibility: <devices>

    """
    exp_params = json.load(open(args.exp_params_file), "r")



def add_participants(total_available_places, num_extra):
    url = f"https://api.prolific.co/api/v1/studies/{args.experiment_id}/"
    params = {"total_available_places": total_available_places + num_extra}
    res = requests.patch(url, headers=AUTH_HEADER, data=json.dumps(params))
    res_json = res.json()
    if "error" in res_json:
        logging.info("""Study Update failed. Error: ", res_json,
                     Are you sure you have the correct experiment ID?""")
        return None

    return res_json

def maybe_add_participants():
    experiment_details = get_experiment_details()
    num_submissions = experiment_details["number_of_submissions"]
    experiment_name = experiment_details["name"]
    internal_name = experiment_details["internal_name"]
    external_url = experiment_details["external_study_url"]
    est_completion_time = experiment_details["estimated_completion_time"]
    avg_time = experiment_details["average_time_taken"]
    logging.info(f"""Checking whether to add participants to experiment:
                        Name: {experiment_name}
                        Internal: {internal_name}
                        Submissions So Far: {num_submissions}
                        URL: {external_url}
                        Expected Completion Time: {est_completion_time} minutes
                        Average Completion Time: {avg_time} minutes""")

    total_available_places = experiment_details["total_available_places"]

    submission_data = list_submissions()
    submissions = submission_data["results"]

    # Sleep while participants are active
    for submission in submissions:
        if submission["status"] == "ACTIVE":
            logging.info(f"Participants still active in experiment: {experiment_name}. \
            Putting Watchdog to sleep for {SLEEP_TIME} seconds...")
            os.sleep(SLEEP_TIME)

    batch_hits = calculate_batch_hits(submissions, experiment_details)
    update_batch_hits(batch_hits)
    hits_remaining = sum([max(0, HITS_PER_BATCH - hits) for hits in batch_hits])

    if not hits_remaining:
        logging.info("No more HITs required. Killing watchdog...")
        sys.exit(1)
        return False
    else:
        logging.info(f"Adding {hits_remaining} remaining HITs to study")
        res = add_participants(total_available_places, hits_remaining)
        return True

def list_submissions():
    """ Returns list of submissions for experiment, given an experiment ID """
    exp_id = args.experiment_id
    params = {"study": exp_id}
    url = f"https://api.prolific.co/api/v1/submissions/"
    resp = prolific_get(url, params=params)
    return resp


def get_experiment_details():
    """ Returns details of an experiment, given an experiment ID """
    exp_id = args.experiment_id
    url = f"https://api.prolific.co/api/v1/studies/{exp_id}/"
    resp = prolific_get(url)
    return resp


def get_batch_inputs():
    """ Returns the input batches of data (including the numGames fields) """
    conn = cabutils.get_db_connection()
    input_db = conn[args.db + "_inputs"]
    col = input_db[args.col]
    df = pd.DataFrame(col.find())
    return df

def get_experiment_results():
    """ Returns the unprocessed results of experimet as DataFrame """
    conn = cabutils.get_db_connection()
    results_db = conn[args.db + "_outputs"]
    col = results_db[args.col]
    df = pd.DataFrame(col.find())
    return df


def main():

