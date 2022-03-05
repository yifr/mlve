import os
import glob
import requests
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify, render_template

import config

# from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
# mongo = PyMongo(app)


def generate_probe_location(masks, probe_contact):
    if probe_contact:
        y, x = np.where(masks)
    else:
        y, x = np.where(masks == 0)

    possible_locations = [loc for loc in zip(x, y)]
    probe_idx = np.random.choice(range(len(possible_locations)))
    loc = possible_locations[probe_idx]
    return [int(l) for l in loc]


def get_trial_data(experiment_type, domain, batch):
    scenes = []
    print(experiment_type, domain, batch)
    if config.LOCAL_IMAGES:
        if domain == "static":
            trial_data = []
            for scene in glob.glob(config.BASE_IMAGE_URLS):
                image_url = os.path.join(scene, "images", "Image0001.png")
                mask_url = os.path.join(scene, "masks", "Image0001.png")
                masks = np.array(Image.open(mask_url).convert("L"))

                # Generate probe location
                probe_contact = (
                    np.random.rand() >= 0.5
                )  # TO-DO Evenly Balance out each experiment?
                probe_location = generate_probe_location(masks, probe_contact)

                # Compute bounding boxes
                bounding_boxes = []
                for mask_val in np.unique(masks):
                    mask_y, mask_x = np.where(masks == mask_val)
                    x_min = int(np.min(mask_x))
                    x_max = int(np.max(mask_x))
                    y_min = int(np.min(mask_y))
                    y_max = int(np.max(mask_y))
                    coords = ((x_min, y_min), (x_max, y_max))
                    bounding_boxes.append(coords)

                trial = {
                    "image_url": image_url,
                    "probe_location": probe_location,
                    "probe_contact": probe_contact,
                    "bounding_boxes": bounding_boxes,
                }

                trial_data.append(trial)

    return trial_data


@app.route("/get_trial_data", methods=["POST"])
def trial_data_wrapper():
    data = request.form
    experiment_type = data.get("experiment")
    domain = data.get("domain")
    batch = data.get("batch")
    trial_data = get_trial_data("detection", "static", 0)
    return jsonify(trial_data)


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")
