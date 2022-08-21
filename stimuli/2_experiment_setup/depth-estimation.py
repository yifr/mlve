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
        elif type(v) == np.bool_:
            dictionary[k] = bool(v)
        elif type(v) == list and type(v[0]) == np.bool_:
            dictionary[k] = [bool(x) for x in v]

    return dictionary

def map_range(X, A, B, C, D):
    interp = interpolater.interp1d((A, B), (C, D))
    return float(interp(X))


def generate_points(width, height, depth_map=None, n_points=10, strategy="equidistant",
                    bias=None):
    """
    width: width of image
    height: height of image
    depth_map: depth map -- will be used to strategically sample points if given
                If depth map is provided, default behavior is to sample half the points
                so that the left side is closer, and half so that the right side is closer
    n_points: how many points to sample
    strategy: currently only supports equidistant, where points are sampled equidistant along a
                horizontal line
    bias: None | same | right | left -> indicates whether sampling of points should be biased
            towards one side being picked or not
    """
    points = []

    def sample(height, y_border, midpoint, offset):
        y = np.random.randint(min_offset, height - y_border)
        offset = np.random.randint(y_border, midpoint)
        point_0 = (int(y), int(midpoint - offset))
        point_1 = (int(y), int(midpoint + offset))
        return point_0, point_1

    if strategy == "equidistant":
        midpoint = width // 2
        ys = np.random.choice(range(height), n_points)
        for i, y in enumerate(ys):
            min_offset = 15         # 15 pixel minimum offset for depth points

            offset = np.random.randint(min_offset, midpoint)    # distance between two points
            point_0 = (int(y), int(midpoint - offset))
            point_1 = (int(y), int(midpoint + offset))
            if depth_map is not None:
                max_tries = 100
                tries = 0
                if bias == "left":
                    # sample point on the left that is closer
                    while depth_map[point_0] >= depth_map[point_1]:
                        point_0, point_1 = sample(height, min_offset, midpoint, offset)
                        if tries == max_tries:
                            print("Could not find a point")
                            break
                        tries += 1
                elif bias == "right":
                    # sample point on the right that is closer
                    while depth_map[point_0] <= depth_map[point_1]:
                        point_0, point_1 = sample(height, min_offset, midpoint, offset)
                        if tries == max_tries:
                            print("Could not find a point")
                            break
                        tries += 1

                elif bias == "same":
                    while depth_map[point_0] != depth_map[point_1]:
                        point_0, point_1 = sample(height, min_offset, midpoint, offset)
                        if tries == max_tries:
                            print("Could not find a point")
                            break
                        tries += 1

            points.append((point_0, point_1))

        return points

def build_trials(root_path, image_path, image_s3_path, n_points, bias_points=None,
                point_sample_strategy="equidistant",
                dataset=None, idx=-1):
    """
    build_trials: builds trials for a given image

    Params:
    -------
    root_path: str: root data directory
    image_path: str: path to image
    image_s3_path: str: path to image on s3
    n_points: int: number of point pairs to generate in an image
    bias_points: str: whether "correct" point is on left or right of image
    point_sample_strategy: str: how to sample points, currently only equidistant supported
    dataset: str: name of dataset
    idx: int: index of image
    """
    image = np.array(Image.open(image_path))
    image_height = image.shape[0]
    image_width = image.shape[1]

    if dataset in ["gestalt", "tdw", "hypersim"]:
        depth_file = os.path.join(root_path, "depths", f"depth_{idx:03d}.hdf5")
        with  h5py.File(depth_file, "r") as f:
            depth_data = f["dataset"][:].astype(np.float16)
    else:
        depth_data = None

    points = generate_points(image_width,
                             image_height,
                             n_points=n_points,
                             depth_map=depth_data,
                             strategy=point_sample_strategy,
                             bias=bias_points
                             )
    trials = []
    for i in range(n_points):
        trial_data = {}
        point_pair = points[i]
        if dataset in ["gestalt", "tdw", "hypersim"]:
            left = point_pair[0]
            right = point_pair[1]
            if depth_data[left] < depth_data[right]:
                trial_data["closer_point"] = left
                trial_data["correct_choice"] = 0
            elif depth_data[right] < depth_data[left]:
                trial_data["closer_point"] = right
                trial_data["correct_choice"] = 1
            else:
                trial_data["closer_point"] = None
                trial_data["correct_choice"] = 2

            depths = [float(depth_data[left]), float(depth_data[right])]
            trial_data["gt_depths"] = depths

        trial_data["imageURL"] = image_s3_path
        trial_data["is_duplicate"] = False
        trial_data["probe_locations"] = point_pair
        trial_data["attention_check"] = False

        with open(os.path.join(root_path, "meta", f"meta_{idx:03d}.pkl"), "rb") as f:
            metadata = pickle.load(f)
            metadata = convert_np_arrays(metadata)

        trial_data["meta"] = metadata
        trials.append(trial_data)

    return trials

def format(dataset):
    conn = cabutils.get_db_connection()
    proj_name = "mlve"
    exp_name = f"{dataset}_depth-estimation"
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
    point_sample_strategy = "equidistant"

    batches = [[] for i in range(points_per_image)]
    for i in range(n_images):
        image_path = os.path.join(root_path, "images", f"image_{i:03d}.png")
        image_s3_path = os.path.join(s3_root, "images", f"image_{i:03d}.png")
        trials = build_trials(root_path, image_path, image_s3_path, n_points=points_per_image, dataset=dataset,
                              bias_points="left" if i % 2 == 0 else "right", idx=i)
        for j, batch in enumerate(batches):
            trial = trials[j]
            trial["batch_idx"] = j
            batch.append(trial)
            print(trial)

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
    print("=" * 40)
    print("FORMATTING FAMILIARIZATION TRIALS")
    print("=" * 40)
    for i in range(5):
        image_path = os.path.join(root_path, "train", "images", f"image_{i:03d}.png")
        image_s3_path = os.path.join(s3_root, "train", "images", f"image_{i:03d}.png")
        bias = np.random.choice(["left", "right"])
        trials = build_trials(root_path, image_path, image_s3_path, n_points=1, dataset=dataset,
                              bias_points=bias, idx=i)
        for trial in trials:
            print(trial)
            familiarization_trials.append(trial)

    with open("attention_checks/depth.json", "r") as f:
        attention_checks = json.load(f)
        for key in attention_checks.keys():
            img_s3_url, points, correct_idx, correct_point = attention_checks[key]
            trial_data = {}
            trial_data["imageURL"] = img_s3_url
            trial_data["probe_locations"] = points
            trial_data["correct_choice"] = correct_idx
            trial_data["closer_point"] = correct_point
            trial_data["attention_check"] = True
            trial_data["is_duplicate"] = False
            print(trial_data)
            for batch in batches:
                batch.append(trial_data)

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
