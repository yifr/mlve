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
app.secret_key = "secret key" # what


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


def get_config(experiment, domain):
    config_path = os.path.join("configs", experiment, domain + ".json")
    config = json.load(open(config_path, "rb"))
    return config


@app.route("/get_trial_data", methods=["GET", "POST"])
def get_trial_data():
    data = request.values
    experiment = data.get("experiment")
    domain = data.get("domain")

    config = session["config"]
    db_name = session["db_name"]
    col_name = session["col_name"]
    if not session.get("batch"):
        batch = get_batch(db_name, experiment, config["n_total_batches"])
    else:
        batch = session["batch"]
    print("batch: ", batch)

    session["domain"] = domain
    session["experiment"] = experiment
    session["batch"] = batch
    session["config"] = config

    session["db_name"] = db_name
    session["col_name"] = col_name

    trial_data_path = os.path.join(config["data_path"], config["data_name"] + f"{batch}.json")

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


def check_repeat_user(user_id, db_name, col):
    if user_id in config.ALLOWED_IDS:
        return False

    client = get_client(db_name)
    db = client[db_name]
    col = db[col]
    res = col.find_one({"user_id": user_id})
    if res:
        return True

    return False

def get_batch(db_name, experiment_name, total_batches=10):
    client = get_client(db_name)
    db = client[db_name]
    batch_info = db["batch_info"]
    res = batch_info.find_one({"experiment_name": experiment_name})
    if not res:
        batch_hits = [0 for i in range(total_batches)]
        batch = 0
        batch_hits[batch] = 1
        batch_info.insert_one({"experiment_name": experiment_name, "batch_hits": batch_hits})
        return batch

    batch_hits = res["batch_hits"]
    batch = batch_hits.index(min(batch_hits))
    batch_hits[batch] += 1
    if session.get("log_results"):
        res = batch_info.update_one({"experiment_name": experiment_name}, 
                                    {"$set": {"batch_hits": batch_hits}}) 
        print("Updated batch info", res)

    return batch

@ app.route("/consent.html", methods=["GET"])
def consent():
    return render_template("consent.html")


@ app.route("/", methods=["GET"])
def home():
    user_id = request.args.get("PROLIFIC_PID")
    session_id = request.args.get("SESSION_ID")
    study_id = request.args.get("STUDY_ID")
    
    experiment = request.args.get("experiment")
    domain = request.args.get("domain")
    batch = request.args.get("batch", None)
    
    config = get_config(experiment, domain)
    db_name = config.get("db_name", "psychophys")
    col_name = config.get("col_name", "test")

    session["config"] = config
    session["db_name"] = db_name
    session["col_name"] = col_name
    session["batch"] = batch

    print("user_id", user_id)
    if not user_id:
        session["log_results"] = False
    else:
        session["log_results"] = True
        repeat_user = check_repeat_user(user_id, db_name, col_name)
        if repeat_user:
            return render_template("reject.html")

    session["study_id"] = study_id
    session["session_id"] = session_id
    session["user_id"] = user_id
    return render_template("index.html")
