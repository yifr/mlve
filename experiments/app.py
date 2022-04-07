import os
import io
import glob
import json
import boto3
import pymongo
import requests
import numpy as np
from PIL import Image
from werkzeug.datastructures import ImmutableMultiDict
from flask import Flask, request, jsonify, render_template, session

import config

with open("auth.json", "rb") as f:
    auth = json.load(f)

MONGO_USER = auth["mongo_user"]
MONGO_PW = auth["mongo_pw"]

app = Flask(__name__)
app.secret_key = "secret key"


def generate_probe_location(masks, probe_touching):
    if probe_touching:
        mask_val = np.random.choice(np.unique(masks))
        mask = masks == mask_val

        y, x = np.where(mask)
        possible_locations = [loc for loc in zip(x, y)]
        probe_idx = np.random.choice(range(len(possible_locations)))
        loc = possible_locations[probe_idx]
        return [int(l) for l in loc], mask
    else:
        y, x = np.where(masks == 0)
        y_buffer, x_buffer = np.where(masks)
        possible_locations = [loc for loc in zip(x, y)]
        while True:
            probe_idx = np.random.choice(range(len(possible_locations)))
            loc = possible_locations[probe_idx]

            # Avoid overlapping edge of probe with shape
            for y_b, x_b in zip(y_buffer, x_buffer):
                if (
                    np.sqrt((loc[1] - y_b) ** 2) < 5
                    and np.sqrt((loc[0] - x_b) ** 2) < 5
                ):
                    return [int(l) for l in loc], None


# @app.route("/get_probe_location", methods=["POST"])
def get_probe_location(
    experiment_type, masks, batch, scene_index, image_index, randomize_contact=True
):

    if experiment_type == "detection":

        # Generate probe location
        if randomize_contact:
            probe_touching = (
                np.random.rand() >= 0.5
            )  # TO-DO Evenly Balance out each experiment?
        else:
            probe_touching = True

        probe_location, mask = generate_probe_location(masks, probe_touching)
        # Compute bounding boxes
        if mask is not None:
            mask_y, mask_x = np.where(mask)
            x_min = int(np.min(mask_x))
            x_max = int(np.max(mask_x))
            y_min = int(np.min(mask_y))
            y_max = int(np.max(mask_y))
            coords = ((x_min, y_min), (x_max, y_max))
            bounding_box = coords
        else:
            bounding_box = []

        return probe_location, probe_touching, bounding_box


def get_client(db_name):
    client = pymongo.MongoClient(
        f"mongodb+srv://{MONGO_USER}:{MONGO_PW}@"
        + f"psychophys.js4h5.mongodb.net/{db_name}"
        + "?retryWrites=true&w=majority"
    )
    return client


@app.route("/post_data", methods=["POST"])
def post_data():
    if not session.get("log_results"):
        return jsonify({"status": 200})

    data = request.get_json()  # json.loads(request.data)
    print(data)

    db_name = session.get("db_name")
    col_name = session.get("col_name")

    client = get_client(db_name)
    db = client[db_name]
    col = db[col_name]
    data["user_id"] = session["user_id"]
    data["experiment"] = session["experiment"]
    data["domain"] = session["domain"]

    resp = col.insert_one(data)
    print(resp)
    return jsonify({"success": 200})


def get_config(experiment, domain, batch):
    config_path = os.path.join("configs", experiment, domain)
    config_opts = glob.glob(config_path + "*")
    config = json.load(open(config_opts[batch], "rb"))
    return config


@app.route("/get_trial_data", methods=["GET", "POST"])
def get_trial_data():
    data = request.values
    experiment = data.get("experiment")
    domain = data.get("domain")
    batch = int(data.get("batch"))
    config = get_config(experiment, domain, batch)
    db_name = config["db_name"]
    col_name = config["col_name"]

    session["domain"] = domain
    session["experiment"] = experiment
    session["batch"] = batch
    session["config"] = config

    session["db_name"] = db_name
    session["col_name"] = col_name

    trial_data_path = os.path.join("stimuli", config["trial_data"][0])

    with open(trial_data_path, "rb") as f:
        data = json.load(f)["data"]

    s3_root = config.get("S3_ROOT")
    practice_trial = {}
    for d in data:
        if "gestalt" in s3_root:
            image_url = d["image_url"]
            components = image_url.split("/")
            texture = components[0]
            n_objs = int(components[1].split("_")[1])
            scene = components[2]
            d["texture"] = texture
            d["n_objs"] = n_objs
            d["scene"] = scene

            # Serve shaded images for attention trials
            if "ground_truth" in d["image_url"]:
                image_target = "shaded"
                if d["probe_touching"]:
                    practice_trial = d
            else:
                image_target = "images"

            d["image_url"] = os.path.join(
                s3_root, d["image_url"],
                image_target,
                f"Image{d['frame_idx']:04d}.png"
            )

        elif "tdw" in s3_root:
            image_url = os.path.join(s3_root, d["image_url"][0][1:])
            d["image_url"] = image_url
            d["gt_bounding_box"] = d["bounding_box"]
            del d["bounding_box"]

            # Assign first scene as practice trial
            if "0009" in d["image_url"]:
                practice_trial = d

    seed = config.get("random_seed", np.random.randint(0, 100))
    np.random.seed(seed)
    np.random.shuffle(data)

    print(f"Serving {len(data)} trials")
    data = {"experimentData": data,
            "experimentConfig": config,
            "user_id": session.get("user_id"),
            "session_id": session.get("session_id"),
            "study_id": session.get("study_id"),
            "completion_code": config.get("completion_code")
            }

    return jsonify(data)


def check_repeat_user(user_id, db, col):
    if user_id in config.ALLOWED_IDS:
        return False

    client = get_client(db)
    db = client[db]
    col = db[col]
    res = col.find_one({"user_id": user_id})
    if res:
        return True

    return False


@ app.route("/consent.html", methods=["GET"])
def consent():
    return render_template("consent.html")


@ app.route("/", methods=["GET"])
def home():
    user_id = request.args.get("PROLIFIC_PID")
    session_id = request.args.get("SESSION_ID")
    study_id = request.args.get("STUDY_ID")

    db = request.args.get("db")
    col_name = request.args.get("col")
    print("user_id", user_id)
    if not user_id:
        print(f"missing one of user_id: {user_id}, db: {db}, col: {col_name}")
        session["log_results"] = False
    else:
        session["log_results"] = True
        repeat_user = check_repeat_user(user_id, db, col_name)
        if repeat_user:
            return render_template("reject.html")

    session["study_id"] = study_id
    session["session_id"] = session_id
    session["user_id"] = user_id
    return render_template("index.html")
