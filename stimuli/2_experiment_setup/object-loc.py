import os
import sys
import cv2
import json
import pickle
import numpy as np
import pandas as pd
import h5py

from tqdm import tqdm
from glob import glob
from PIL import Image

sys.path.append("../../")
import cabutils

import argparse

def convert_np_arrays(dictionary):
    for k, v in dictionary.items():
        if type(v) == np.ndarray:
            dictionary[k] = v.tolist()
        elif type(v) == dict:
            dictionary[k] = convert_np_arrays(dictionary[k])
        elif type(v) == np.bool_:
            dictionary[k] = bool(v)
        elif type(v) == list and type(v[0]) == np.bool_:
            dictionary[k] = [bool(x) for x in v]

    return dictionary

def points_in_circle(radius, x0=0, y0=0, ):
    x_ = np.arange(x0 - radius - 1, x0 + radius + 1, dtype=int)
    y_ = np.arange(y0 - radius - 1, y0 + radius + 1, dtype=int)
    x, y = np.where((x_[:,np.newaxis] - x0)**2 + (y_ - y0)**2 <= radius**2)
    for x, y in zip(x_[x], y_[y]):
        yield x, y

def check_overlap(point, border_dist, min_dist, image):
    min_point = lambda p: max(0, p - min_dist)
    max_point = lambda p: min(width, p + min_dist)
    width = image.shape[0]
    x, y = point
    r = 20

    for x_t, y_t in points_in_circle(radius=r, x0=point[0], y0=point[1]):
        if x_t > (width - border_dist) or y_t > (width - border_dist) \
                or x_t < border_dist or y_t < border_dist:
            return True

        if image[y_t, x_t] != image[point[1], point[0]]:
            return True

    return False

def get_idxs(masks):
    mask_vals = np.unique(masks)
    mask_val = np.random.choice(mask_vals[1:])
    mask_idx = list(mask_vals[1:]).index(mask_val)
    print(mask_vals, mask_val, mask_idx)
    mask = np.where(masks == mask_val, masks, 0)
    y, x = np.where(masks == mask_val)
    return y, x, mask, mask_val, mask_idx

def generate_probe_location(masks, probe_touching):
    location_found = False
    if not probe_touching:
        mask_val = 0
        y, x = np.where(masks)
        mask = None
        mask_idx = 0
        possible_locations = [loc for loc in  zip(x, y)]

    max_tries = 50
    tries = 0
    while not location_found:
        if probe_touching:
            print("SAMPLED LOCATION... " + str(tries) + " tries")
            y, x, mask, mask_val, mask_idx = get_idxs(masks)
            possible_locations = [loc for loc in  zip(x, y)]
            print(str(len(possible_locations)) + " possible probe locations")
        min_dist = 1
        border_dist = 1
        width = masks.shape[0]
        if len(possible_locations) == 0:
            print("NO LOCATIONS FOUND", mask_idx, mask_val)
            return [np.random.choice(range(masks.shape[0])) for i in range(2)], mask, mask_idx, mask_val

        loc = possible_locations[np.random.choice(len(possible_locations))]
        overlap = check_overlap(loc, border_dist, min_dist, masks)
        overlap = False
        tries += 1
        if not overlap or tries > max_tries:
            return [int(l) for l in loc], mask, mask_idx, mask_val

def get_probe_location(masks, probe_touching=True):

    probe_location, mask, mask_idx, mask_val = generate_probe_location(masks, probe_touching)

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

    return probe_location, bounding_box, mask_idx, mask_val

def generate_trial(root_path, image_s3_url, probe_touching, trial_idx, export_path=""):
    # Alternate on/off trials based on batch index
    mask_path = os.path.join(root_path, "masks", f"mask_{trial_idx:03d}.png")
    mask = np.array(Image.open(mask_path).convert("L"))
    probe_location, bbox, mask_idx, mask_val = get_probe_location(mask, probe_touching=probe_touching)
    meta_path = os.path.join(root_path, "meta", f"meta_{trial_idx:03d}.pkl")
    if not os.path.exists(meta_path):
        meta = {}
    else:
        with open(meta_path, "rb") as f:
            meta = convert_np_arrays(pickle.load(f))
    print(bbox)
    trial_data = {
        "image_url": image_s3_url,
        "probe_touching": probe_touching,
        "probe_location": probe_location,
        "gt_bounding_box": bbox,
        "mask_idx": int(mask_idx),
        "mask_val": int(mask_val),
        "meta": meta,
        "is_duplicate": False,
        "attention_check": False,
    }

    return trial_data

def format(args):
    conn = cabutils.get_db_connection()
    proj_name = args.proj_name
    exp_name = f"{args.dataset}_object-loc"
    iter_name = args.iter_name

    db = conn["mlve_inputs"]
    col = db[exp_name]
    col.drop()

    root_path = os.path.join("/om/user/yyf/mlve/stimuli/" , args.dataset)
    s3_root = os.path.join("https://mlve-v1.s3.us-east-2.amazonaws.com/", args.dataset)
    export_path = "/om/user/yyf/mlve/stimuli/" + args.dataset + "-sampled-points/" + exp_name
    os.makedirs(export_path, exist_ok=True)

    n_images = 100
    n_batches = args.n_batches
    batches = [[] for i in range(n_batches)]
    for i in range(n_images):
        points = []
        for batch_num in range(n_batches):
            image_s3_path = os.path.join(s3_root, "images", f"image_{i:03d}.png")
            if batch_num % 2 == 0:  #
                if i % 2 == 0:
                    probe_touching = True
                else:
                    probe_touching = False
            else:
                if i % 2 == 0:
                    probe_touching = False
                else:
                    probe_touching = True

            trial_data = generate_trial(root_path, image_s3_path, probe_touching, i, export_path=export_path)
            points.append(trial_data["probe_location"])
            trial_data["batch_num"] = batch_num
            batches[batch_num].append(trial_data)
            print("Batch num: ", batch_num)
            print(trial_data)

        image_draw = cv2.imread(os.path.join(root_path, "images", f"image_{i:03d}.png"))
        for point in points:
            image_draw = cv2.circle(image_draw, (point[1], point[0]), 7, (25, 25, 255), -1)
        export_fpath = os.path.join(export_path, f"points_{i:03d}.png")
        cv2.imwrite(export_fpath, image_draw)

    # Generate familiarization trials
    familiarization_trials = []
    for i in range(5):
        image_s3_path = os.path.join(s3_root, "train", "images", f"image_{i:03d}.png")
        probe_touching = np.random.random() > 0.4
        trial_data = generate_trial(os.path.join(root_path, "train"), image_s3_path, probe_touching, i)
        familiarization_trials.append(trial_data)

    metadata = {"proj_name": args.proj_name, "exp_name": exp_name, "iter_name": args.iter_name}
    for i, batch in enumerate(batches):
        data = {"metadata": metadata,
                "trials": batch,
                "familiarization_trials": familiarization_trials
                }
        res = col.insert_one({"data": data})
        print("Sent data to MongoDB store: ", res)

if __name__=="__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=str, required=True)
    parser.add_argument("--iter_name", type=str, required=True, help="Experiment Iteration Name")
    parser.add_argument("--proj_name", type=str, default="mlve")
    parser.add_argument("--n_batches", type=int, default=2)
    parser.add_argument("--add_videos", action="store_true")
    args = parser.parse_args()
    format(args)
