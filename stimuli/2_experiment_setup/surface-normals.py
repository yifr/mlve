import os
import sys
import h5py
import json
import random
import pickle
import numpy as np
from glob import glob
from tqdm import tqdm
from PIL import Image
import scipy.interpolate as interpolater

sys.path.append("../")
from utils import probes
sys.path.append("../../")
import cabutils

def convert_np_arrays(dictionary):
    for k, v in dictionary.items():
        if type(v) == np.ndarray:
            dictionary[k] = v.tolist()
        elif type(v) == dict:
            dictionary[k] = convert_np_arrays(dictionary[k])

    return dictionary

def map_range(X, A, B, C, D):
    interp = interpolater.interp1d((A, B), (C, D))
    return float(interp(X))


def generate_points(width, height, n_points=10, constraint=None, strategy="masks"):
    """
    randomly generates n_points in an image with width and height. If nan_constraint
    is not none, points are not sampled anywhere where the value of nan_constraint
    is nan

    lotta bugs and edge cases here (doesn't check for duplicates)
    """
    if strategy == "masks":
        points_y, points_x = np.where(constraint > 0)
        if len(points_y) == 0:
            points = [(np.random.randint(0, constraint.shape[0]),
                       np.random.randint(0, constraint.shape[1]))
                      for i in range(n_points)]
            return points

        locs = np.random.choice(len(points_y), n_points)
        y_samples = points_y[locs]
        x_samples = points_x[locs]
        points = [(y_samples[i], x_samples[i]) for i in range(n_points)]

    elif strategy == "normals":
        # Points are sampled as (y, x)
        points = [(np.random.randint(0, height),
                   np.random.randint(0, width)) for i in range(n_points)]

        assert len(set(points)) == n_points
        if constraint is not None:
            for point in points:
                if constraint[point].any() == float("nan"):
                    del point
                    points.append((np.random.randint(0, height), np.random.randint(0, width)))

    elif strategy == "uniform":
        height, width = constraint
        points = [(np.random.randint(0, height), np.random.randint(0, width))
                  for i in range(n_points)]

    return points

def format(dataset):
    conn = cabutils.get_db_connection()
    proj_name = "mlve"
    exp_name = f"{dataset}_surface-normals"
    iter_name = "v2"

    db = conn["mlve_inputs"]
    col = db[exp_name]
    col.drop()

    """
    Experiment design:
        1. 100 training images
        2. 10 batches (ie; 10 points sampled per image)
        3. Repeat 10 images per batch for intra-participant reliability
            3a. Each reliability image is run 3 times
            3b. Select different 10 in each batch (ie; batch 1: repat 0-9, batch 2: 10-19, ...)A
        4. Sample points randomly to start
    """

    root_path = "/om/user/yyf/mlve/stimuli/" + dataset
    s3_root = "https://mlve-v1.s3.us-east-2.amazonaws.com/" + dataset

    n_images = 100
    points_per_image = 10
    n_repeats = 10
    repeat_times = 3
    point_sample_strategy = "masks"

    batches = [[] for i in range(points_per_image)]
    for i in range(n_images):
        image_path = os.path.join(root_path, "images", f"image_{i:03d}.png")
        image_s3_path = os.path.join(s3_root, "images", f"image_{i:03d}.png")

        image = np.array(Image.open(image_path))
        image_height = image.shape[0]
        image_width = image.shape[1]

        if dataset in ["gestalt", "tdw", "hypersim"]:

            normal_file = os.path.join(root_path, "normals", f"normal_{i:03d}.hdf5")
            with  h5py.File(normal_file, "r") as f:
                normal_data = f["dataset"][:]

            if point_sample_strategy == "masks":
                mask_path = os.path.join(root_path, "masks", f"mask_{i:03d}.png")
                masks = Image.open(mask_path).convert("L")
                constraint = np.array(masks)
            else:
                constraint = normal_data
        else:
            point_sample_strategy = "uniform"
            constraint = image.shape[:2]

        points = generate_points(image_width,
                                 image_height,
                                 n_points=10,
                                 constraint=constraint,
                                 strategy=point_sample_strategy
                                 )
        for j, batch in enumerate(batches):
            trial_data = {}
            point = points[j]
            if dataset in ["gestalt", "tdw", "hypersim"]:
                normal_vec = normal_data[point]
                trial_data["trueArrowDirection"] = [float(x) for x in normal_vec]

            trial_data["imageURL"] = image_s3_path
            trial_data["is_duplicate"] = False
            trial_data["randomizeArrowInitialDirection"] = True
            trial_data["arrowPixelPosition"] = [int(x) for x in point]
            trial_data["attention_check"] = False

            canvas_size = image_width / 100
            # Map the pixel position to the canvas size, which is resolution / 100
            arrow_NDC = [map_range(point[1], 0, image_height - 1, -canvas_size, canvas_size),
                         map_range(point[0], 0, image_width - 1, -canvas_size, canvas_size),
                         0]
            trial_data["arrowPosition"] = arrow_NDC
            trial_data["trialType"] = "unsupervised"
            trial_data["batch_idx"] = j
            with open(os.path.join(root_path, "meta", f"meta_{i:03d}.pkl"), "rb") as f:
                metadata = pickle.load(f)
                metadata = convert_np_arrays(metadata)

            trial_data["meta"] = metadata
            print(trial_data)
            batch.append(trial_data)

    with open("attention_checks/surface_normals.json", "r") as f:
        attention_checks = json.load(f)
        for key in attention_checks.keys():
            img_s3_url, point, normal_vec, (image_height, image_width) = attention_checks[key]
            trial_data = {}
            trial_data["imageURL"] = img_s3_url
            trial_data["trueArrowDirection"] = [float(x) for x in normal_vec]
            trial_data["randomizeArrowInitialDirection"] = True
            trial_data["arrowPixelPosition"] = [int(x) for x in point]
            canvas_size = image_width / 100
            arrow_NDC = [map_range(point[1], 0, image_height - 1, -canvas_size, canvas_size),
                         map_range(point[0], 0, image_width - 1, -canvas_size, canvas_size),
                         0]
            trial_data["arrowPosition"] = arrow_NDC
            trial_data["attention_check"] = True
            trial_data["trialType"] = "unsupervised"
            trial_data["is_duplicate"] = False
            print(trial_data)
            for batch in batches:
                batch.append(trial_data)

    # Add repeats
    for batch_idx in range(len(batches)):
        repeat_start = 10 * batch_idx
        repeat_trials = batches[batch_idx][repeat_start:repeat_start + 10]
        for trial in repeat_trials:
            trial["is_duplicate"] = True

        for i in range(2):
            batches[batch_idx].extend(repeat_trials)

        random.shuffle(batches[batch_idx])

    # add familiarization trials
    familiarization_trials = []
    for i in range(5):
        image_path = os.path.join(root_path, "train", "images", f"image_{i:03d}.png")
        image_s3_path = os.path.join(s3_root, "train", "images", f"image_{i:03d}.png")

        image = np.array(Image.open(image_path))
        image_height = image.shape[0]
        image_width = image.shape[1]

        if dataset in ["gestalt", "tdw", "hypersim"]:
            normal_file = os.path.join(root_path, "train", "normals", f"normal_{i:03d}.hdf5")
            with  h5py.File(normal_file, "r") as f:
                normal_data = f["dataset"][:]

            if point_sample_strategy == "masks":
                mask_path = os.path.join(root_path, "train", "masks", f"mask_{i:03d}.png")
                masks = Image.open(mask_path).convert("L")
                constraint = np.array(masks)
            else:
                constraint = normal_data

            point = generate_points(width=image_width,
                                height=image_height,
                                n_points=1,
                                constraint=constraint,
                                strategy=point_sample_strategy,
                                )[0]
            normal_vec = normal_data[point]

        else:
            fam_trials = json.load(open(f"additional/{dataset}_normals.json", "r"))
            point, normal_vec = fam_trials[str(i)]

        trial_data = {}
        trial_data["imageURL"] = image_s3_path
        trial_data["trueArrowDirection"] = [float(x) for x in normal_vec]
        trial_data["randomizeArrowInitialDirection"] = True
        trial_data["arrowPixelPosition"] = [int(x) for x in point]
        trial_data["attention_check"] = False
        canvas_size = image_width / 100
        arrow_NDC = [map_range(point[1], 0, image_height - 1, -canvas_size, canvas_size),
                     map_range(point[0], 0, image_width - 1, -canvas_size, canvas_size),
                     0]
        trial_data["arrowPosition"] = arrow_NDC
        if i > 3:
            trial_data["trialType"] = "reinforcement"
        else:
            trial_data["trialType"] = "supervised"

        with open(os.path.join(root_path, "meta", f"meta_{i:03d}.pkl"), "rb") as f:
            metadata = pickle.load(f)
            metadata = convert_np_arrays(metadata)

        trial_data["meta"] = metadata
        print(trial_data)
        familiarization_trials.append(trial_data)

    metadata = {"proj_name": proj_name, "exp_name": exp_name, "iter_name": iter_name}
    for i, batch in enumerate(batches):
        metadata["batch_idx"] = i
        data = {"metadata": metadata,
                "trials": batch,
                "familiarization_trials": familiarization_trials}
        res = col.insert_one({"data": data})
        print("Sent data to MongoDB store: ", res)

dataset = sys.argv[1]
format(dataset)
