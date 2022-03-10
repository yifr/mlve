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
                    np.sqrt((loc[1] - y_b) ** 2) > 2.5
                    and np.sqrt((loc[0] - x_b) ** 2) > 2.5
                ):
                    return [int(l) for l in loc], None


# @app.route("/get_probe_location", methods=["POST"])
def get_probe_location(
    experiment_type, domain, batch, scene_index, image_index, randomize_contact=True
):

    if experiment_type == "detection":
        if domain == "static":
            scene = glob.glob(config.BASE_IMAGE_URLS)[scene_index]
            mask_url = os.path.join(scene, "masks", f"Image{image_index:04d}.png")
            masks = np.array(Image.open(mask_url).convert("L"))

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


@app.route("/get_trial_data", methods=["POST"])
def trial_data_wrapper():
    data = request.form
    experiment_type = data.get("experiment")
    domain = data.get("domain")
    batch = data.get("batch")
    if config.LOCAL_IMAGES:
        if domain == "static":
            trial_data = []
            for scene_index, scene in enumerate(glob.glob(config.BASE_IMAGE_URLS)[:20]):
                image_index = np.random.randint(1, 32)

                image_url = os.path.join(scene, "images", f"Image{image_index:04d}.png")
                probe_location, probe_touching, bounding_box = get_probe_location(
                    experiment_type, domain, batch, scene_index, image_index
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
    return jsonify(trial_data)


@app.route("/save_trial", methods=["POST"])
def save_to_db():
    data = request.form
    user_id = data.get("user_id")


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")
