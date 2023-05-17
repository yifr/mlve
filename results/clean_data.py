import os
import sys
import pymongo
import numpy as np
import pandas as pd
from random import shuffle

"""
Cleaning data:
1. Filter everyone who failed attention checks
2. Filter everyone who didn't finish the experiment(?)
2b. Filter people who finished way too quickly?
3. Drop nans
4. Drop unneeded columns, rename other columns to be more standardized
5. Create new collection with cleaned data
"""

conn = pymongo.MongoClient("mongodb://localhost:27017/")
db = conn["mlve_outputs"]

experiments = [
 'gestalt_shapegen-depth-estimation-pilot',
 'gestalt_shapegen-depth-estimation-split-half',
 'gestalt_shapegen-segmentation-split-half',
 'gestalt_shapegen-surface-normals',
 'gestalt_shapegen-surface-normals-split-half',
 'hypersim_surface-normals',
 'hypersim_surface-normals-splithalf',
 'hypersim_v2-depth-estimation-pilot',
 'hypersim_v3-depth-estimation-split-half',
 'hypersim_v3-segmentation-split-half',
 'hypersim_v3-surface-normals',
 'nsd-depth-estimation-pilot',
 'nsd-segmentation',
 'nsd-surface-normals',
 'nsd_surface-normals',
 'tdw-depth-estimation-pilot',
 'tdw-depth-estimation-split-half',
 'tdw-segmentation',
 'tdw-segmentation-split-half',
 'tdw-surface-normals-split-half',
 'tdw_surface-normals']

depth_experiments = [
'tdw-depth-estimation-split-half',
'tdw-depth-estimation-pilot',
'hypersim_v2-depth-estimation-pilot',
'hypersim_v3-depth-estimation-split-half',
'nsd-depth-estimation-pilot',
'gestalt_shapegen-depth-estimation-pilot',
'gestalt_shapegen-depth-estimation-split-half',
]

segmentation_experiments = [
'hypersim_v3-segmentation-split-half',
'nsd-segmentation',
'gestalt_shapegen-segmentation-split-half',
'tdw-segmentation',
'tdw-segmentation-split-half',
]

surface_normals_experiments = [
'nsd_surface-normals',
'nsd-surface-normals',
'hypersim_surface-normals-splithalf',
'hypersim_surface-normals',
'hypersim_v3-surface-normals',
'tdw_surface-normals',
'tdw-surface-normals-split-half',
'gestalt_shapegen-surface-normals-split-half',
'gestalt_shapegen-surface-normals',
]

"""
TODO: 
- For each experiment, filter out people who failed attention checks
- For each experiment, filter out people who didn't finish?
- Filter people who finished way too quickly?
- For each experiment, drop nans
- Drop irrelevant columns (ie; keep userID, metadata, gt if exists, response, response time?, probe locations, batchID?)
- Combine nsd-surface-normals experiments
- Aggregate results for split halfs and pilots / large scale experiments
- Store in csvs
- Write to mongo?
"""

def load_experiment(exp_name):
    col = db[exp_name]
    records = []
    count = 0
    for record in col.find({}):
        records.append(record)
        count += 1
    
    print(f"Returning {count} records for {exp_name}")
    df = pd.DataFrame(records)
    return df

def unit_vector(vector):
    """ Returns the unit vector of the vector.  """
    return vector / np.linalg.norm(vector)

def angular_dist(v1, v2, use_degrees=True):
    """ Returns the angle in radians between vectors 'v1' and 'v2':
    """
    if v1 == [] or v2 == [] or v1 == None or v2 == None or \
        (type(v1) == list and len(v1) > 0 and (v1[0] == None or np.isnan(v1[0]))) or \
        (type(v2) == list and len(v2) > 0 and (v2[0] == None or np.isnan(v2[0]))):
        return None

    v1_u = unit_vector(v1)
    v2_u = unit_vector(v2)
    radians = np.arccos(np.clip(np.dot(v1_u, v2_u), -1.0, 1.0))
    degrees = np.degrees(radians)
    if np.any(np.isnan(degrees)):
        return None
        
    if not use_degrees:
        return radians
    else:
        return degrees

def filter_attention_checks(df, experiment_type):
    attention_key = [x for x in df.columns if "attention" in x.lower()][0]  
    attention_checks = df[df[attention_key] == True]
    if len(attention_checks.isna().sum()) > len(attention_checks) / 4:
        return df

    drop_ids = []
    if experiment_type == "surface-normals":
        attention_checks["angular_error"] = attention_checks.apply(lambda x: angular_dist(x["indicatorFinalDirection"], x["trueArrowDirection"]), axis=1)
        for user, att_trials in attention_checks.groupby("userID"):
            if att_trials["angular_error"].mean() > 60:
                drop_ids.append(user)
    
    elif experiment_type == "depth":
        for user, att_trials in attention_checks.groupby("userID"):
            if att_trials["correct"].mean() < 0.5:
                drop_ids.append(user)

    elif experiment_type == "segmentation":
        if "segmentation_correct" in df.columns:
            correct_key = "segmentation_correct"
        else:
            correct_key = "correct"
        for user, att_trials in attention_checks.groupby("userID"):
            if att_trials[correct_key].mean() < 0.5:
                drop_ids.append(user)

    df = df.drop(attention_checks.index)
    df = df[~df["userID"].isin(drop_ids)]
    return df

def filter_incomplete(df):
    incomplete = []
    # count max number of times a specific user ID has shown up
    total_trials = int(df["userID"].value_counts().median())
    for user, trials in df.groupby("userID"):
        if len(trials) < total_trials:
            incomplete.append(user)

    df = df[~df["userID"].isin(incomplete)]
    return df

def filter_by_time(df):
    if df["time_elapsed"].isna().sum() > len(df) / 4:
        # If more than 25% of response times are missing, don't filter
        return df
    too_fast = []
    mean_response_time = df.groupby("userID")["time_elapsed"].max().mean()  # mean response time for whole experiment
    response_time_std = df.groupby("userID")["time_elapsed"].max().std() 
    for user, trials in df.groupby("userID"):
        if trials["time_elapsed"].max() < mean_response_time - response_time_std or \
            trials["time_elapsed"].max() > mean_response_time + (response_time_std * 2):
            too_fast.append(user)
    
    df = df[~df["userID"].isin(too_fast)]
    return df

def drop_duplicates(df):
    is_duplicate = [x for x in df.columns if "duplicate" in x.lower()][0]
    df = df[df[is_duplicate] == False]
    return df

def obscure_ids(df):
    def shuffle(x):
        x = list(x)
        np.random.shuffle(x)
        return ''.join(x)
    shuffled = {}
    for userID in df["userID"].unique():
        shuffled[userID] = shuffle(userID)
    
    df["ID"] = df["userID"].apply(lambda x: shuffled[x])

    return df

def filter_cols(df, experiment_type):
    """
    Obscures IDs, standardizes naming schemes for columns, and drops irrelevant columns
    """
    df = obscure_ids(df)
    
    # Rename columns
    batch_key = [x for x in df.columns if "batch" in x.lower()][0]
    meta_key = [x for x in df.columns if "meta" in x.lower()][0]
    if experiment_type == "surface-normals":
        angular_error = df.apply(lambda x: angular_dist(x["indicatorFinalDirection"], x["trueArrowDirection"]), axis=1)
        df["score"] = angular_error
        df = df.drop(columns=["response"])

        rename = {"indicatorFinalDirection": "response", 
                "trueArrowDirection": "gt", 
                "arrowPixelPosition": "probeLocation",
                batch_key: "batchID", 
                meta_key: "metadata",
                }
        df.rename(columns=rename, inplace=True)

    elif experiment_type == "segmentation":
        if "segmentation_correct" in df.columns:
            correct_key = "segmentation_correct"
            response_key = "segmentation_response"
            df = df.drop(columns=["response"])
        else:
            correct_key = "correct"
            response_key = "response"
        rename = {correct_key: "score", 
                "sameObj": "gt", 
                response_key: "response",
                batch_key: "batchID",
                meta_key: "metadata", 
                "probe_locations": "probeLocation"
                }
        df = df.rename(columns=rename)
    
    elif experiment_type == "depth":
        if "depth_correct" in df.columns:
            correct_key = "depth_correct"
            response_key = "depth_response"
            df = df.drop(columns=["response"])
        else:
            correct_key = "correct"
            response_key = "response" 
        rename = {correct_key: "score", 
                "gtDepths": "gt", 
                response_key: "response",
                batch_key: "batchID",
                meta_key: "metadata", 
                "probe_locations": "probeLocation"
                }
        df = df.rename(columns=rename)
        if not "gt" in df.columns:
            df["gt"] = None
            df["score"] = None

    # Drop irrelevant columns 
    # ID: Obscured user ID, imageURL: url, gt: ground truth if exists, response: user response, score: correctness score, batchID: batch ID
    df = df[["ID", "imageURL", "gt", "response", "score", "probeLocation", "batchID", "expName", "iterationName"]]
    # Drop rows where response is NaN
    df = df.dropna(subset=["response"])
    print(df.info())

    return df

def filter_df(df, experiment_type):
    print("Total records: ", len(df))
    # Filter anyone who failed attention checks
    df = filter_attention_checks(df, experiment_type)
    print("After filtering attention check fails: ", len(df))
    # Filter people who didn't complete experiment
    df = filter_incomplete(df)
    print("After filtering incomplete: ", len(df))
    # Filter people who finished too fast or slow
    df = filter_by_time(df)
    print("After filtering by time: ", len(df))
    # Drop duplicate trials (for intra-user reliability)
    df = drop_duplicates(df)
    print("After dropping duplicates: ", len(df))
    # Standardize column names, obscure IDs, and drop irrelevant columns and NaN rows
    df = filter_cols(df, experiment_type)
    df["experiment_type"] = experiment_type
    
    return df
    
def get_experiment_type(experiment):
    if "normal" in experiment:
        return "surface-normals"
    elif "segmentation" in experiment:
        return "segmentation"
    elif "depth" in experiment:
        return "depth"

cleaned_db = conn["mlve_results"]
cleaned_db.drop_collection("results")
cleaned_col = cleaned_db["results"]

total_records = 0
for experiment in experiments:
    print("*"*80 +  "\n" + f"\t\Processing Experiment: {experiment}\n" + "*"*80)
    exp_col = db[experiment]
    df = load_experiment(experiment)

    experiment_type = get_experiment_type(experiment)
    df = filter_df(df, experiment_type)
    total_records += len(df)
    print("="*80 +  "\n" + f"\t\tExperiment: {experiment}:\n\t\tTotal records: {len(df)}\n" + "="*80)

    cleaned_col.insert_many(df.to_dict("records"))
    
print("Total records: ", total_records)