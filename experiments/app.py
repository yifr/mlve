import os
import io
import glob
import json
from tkinter import W
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

    db_name = data.get("db_name")
    col_name = data.get("col_name")

    client = get_client(db_name)
    db = client[db_name]
    col = db[col_name]
    resp = col.insert_one(data)
    print(resp)
    return jsonify({"success": 200})


@app.route("/get_trial_data", methods=["GET", "POST"])
def trial_data_wrapper():
    data = request.form
    experiment_type = data.get("experiment")
    domain = data.get("domain")
    batch = data.get("batch")
    if config.PREPROCESSED:
        preprocessed_path = "stimuli/detection_pilot_batch_0.json"
        with open(preprocessed_path, "rb") as f:
            data = json.load(f)["data"]

        s3_root = config.S3_ROOT
        for d in data:
            image_url = d["image_url"]
            components = image_url.split("/")
            texture = components[0]
            n_objs = int(components[1].split("_")[1])
            scene = components[2]
            d["texture"] = texture
            d["n_objs"] = n_objs
            d["scene"] = scene
            d["image_url"] = os.path.join(
                s3_root, d["image_url"], "images", f"Image{d['frame_idx']:04d}.png"
            )

        np.random.seed(config.random_seed)
        np.random.shuffle(data)

        print(f"Serving {len(data)} trials")
        data = {"data": data, "user_id": session.get("user_id")}
        return jsonify(data)

    if config.LOCAL_IMAGES:
        if domain == "static":
            trial_data = []

            for scene_index, scene in enumerate(glob.glob(config.BASE_IMAGE_URLS)[:20]):
                image_index = np.random.randint(1, 32)

                image_url = os.path.join(
                    scene, "images", f"Image{image_index:04d}.png")
                scene = glob.glob(config.BASE_IMAGE_URLS)[scene_index]

                mask_url = os.path.join(
                    scene, "masks", f"Image{image_index:04d}.png")
                masks = np.array(Image.open(mask_url).convert("L"))

                probe_location, probe_touching, bounding_box = get_probe_location(
                    experiment_type, masks, batch, scene_index, image_index
                )
                trial = {
                    "image_url": image_url,
                    "stimulus_index": (scene_index, image_index),
                    "probe_location": probe_location,
                    "probe_touching": probe_touching,
                    "bounding_box": bounding_box,
                }
                trial_data.append(trial)
                print(scene_index)
    else:
        try:
            bucket_name = config.S3_BUCKET
            texture_splits = config.TEXTURE_SPLITS
            objs_per_scene = config.OBJS_PER_SCENE
            scenes_per_texture = config.SCENES_PER_TEXTURE
            frames_per_scene = config.FRAMES_PER_SCENE
            trials_per_batch = config.TRIALS_PER_BATCH
            s3_root = config.S3_ROOT

            s3 = boto3.resource("s3")
            bucket = s3.Bucket(bucket_name)
            if domain == "static":
                trial_data = []
                for i in range(trials_per_batch):
                    # TO-DO: Un-randomize batches
                    idx = int(np.random.choice(
                        (range(1, frames_per_scene + 1))))
                    texture = np.random.choice(texture_splits)
                    scene_objs = np.random.choice(objs_per_scene)
                    scene_num = int(np.random.choice(
                        range(0, scenes_per_texture)))

                    image_url = f"{s3_root}/{texture}/{scene_objs}/scene_{scene_num:03d}/images/Image{idx:04d}.png"

                    mask_path = f"{texture}/{scene_objs}/scene_{scene_num:03d}/masks/Image{idx:04d}.png"
                    obj = bucket.Object(mask_path)
                    file_stream = io.BytesIO()
                    obj.download_fileobj(file_stream)
                    masks = np.array(
                        Image.open(file_stream).convert("L").resize((512, 512))
                    )
                    print(masks.shape)
                    probe_location, probe_touching, bounding_box = get_probe_location(
                        experiment_type, masks, batch, -1, -1
                    )
                    trial = {
                        "image_url": image_url,
                        "stimulus_index": (-1, -1),
                        "probe_location": probe_location,
                        "probe_touching": probe_touching,
                        "bounding_box": bounding_box,
                        "user_id": session.get("user_id"),
                    }
                    trial_data.append(trial)
        except Exception as e:
            print(e)
            return e

    return jsonify(trial_data)


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


@app.route("/", methods=["GET"])
def home():
    user_id = request.args.get("PROLIFIC_PID")
    db = request.args.get("db")
    col_name = request.args.get("col")
    print("user_id", user_id)
    if not user_id or not db or not col_name:
        print(f"missing one of user_id: {user_id}, db: {db}, col: {col_name}")
        session["log_results"] = False
    else:
        session["log_results"] = True
        repeat_user = check_repeat_user(user_id, db, col_name)
        if repeat_user:
            return render_template("reject.html")

    session["user_id"] = user_id
    return render_template("index.html")
