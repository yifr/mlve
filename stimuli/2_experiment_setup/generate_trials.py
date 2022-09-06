import os
import sys
import cv2
import h5py
import json
import random
import pickle
import numpy as np
from glob import glob
from tqdm import tqdm
from PIL import Image
from argparse import ArgumentParser
import scipy.interpolate as interpolater

sys.path.append("../")
from utils import probes
sys.path.append("../../")
import cabutils

parser = ArgumentParser()
parser.add_argument("--dataset", type=str, required=True)
parser.add_argument("--experiment_type", type=str, required=True, help="choice: [surface-normals, depth-estimation, object-loc]")
parser.add_argument("--experiment_name_addons", type=str, default="", help="additional tags for experiment name")
parser.add_argument("--iter_name", type=str, required=True)
parser.add_argument("--n_batches", type=int, default=100)
parser.add_argument("--project", type=str, default="mlve")

args = parser.parse_args()

SYNTHETIC_DATASETS = ["gestalt", "gestalt_shapegen", "hypersim_v2", "tdw"]
S3_ROOT = "https://mlve-v1.s3.us-east-2.amazonaws.com/" + args.dataset
S3_TRAIN_ROOT = "https://mlve-v1.s3.us-east-2.amazonaws.com/" + args.dataset + "/train"
IMAGE_ROOT = "/om/user/yyf/mlve/stimuli/" + args.dataset
IMAGE_TRAIN_ROOT = "/om/user/yyf/mlve/stimuli/" + args.dataset + "/train"
print(S3_ROOT, IMAGE_ROOT)

def denumpy_dictionary(dictionary):
    """
    Removes any np lists and np.bool_ types from
    a dictionary
    """
    for k, v in dictionary.items():
        if type(v) == np.ndarray:
            dictionary[k] = v.tolist()
        elif type(v) == np.float32:
            dictionary[k] = float(v)
        elif type(v) == list and len(v) > 0 and type(v[0]) == np.float32:
            dictionary[k] = [float(x) for x in v]
        elif type(v) == np.bool_:
            dictionary[k] = bool(v)
        elif type(v) == list and len(v) > 0 and type(v[0]) == np.bool_:
            dictionary[k] = [bool(x) for x in v]
        elif type(v) == dict:
            dictionary[k] = denumpy_dictionary(dictionary[k])
    return dictionary


def map_range(X, A, B, C, D):
    interp = interpolater.interp1d((A, B), (C, D))
    return float(interp(X))


def points_in_circle(radius, x0=0, y0=0):
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

def get_bounding_box_from_mask(masks, mask_val):
    mask_y, mask_x = np.where(masks == mask_val)
    x_min = int(np.min(mask_x))
    x_max = int(np.max(mask_x))
    y_min = int(np.min(mask_y))
    y_max = int(np.max(mask_y))
    bbox = ((x_min, y_min), (x_max, y_max))
    return bbox

def sample_point_from_masks(masks, ignore_pts=[], sample_from="", border_px=15):
    """
    Samples point in an image by randomly choosing a point from a mask
    Will avoid sampling points provided in `ignore_points` list
    params:
    masks: np.ndarray containing masks
    ignore_points: list of (x, y) tuples containing list of points already sampled
    border_px: int: distance from border to avoid
    """
    mask_vals = np.unique(masks)
    mask_shape = masks.shape[0]
    while True:
        if sample_from == "background":
            mask_val = min(mask_vals)
        elif sample_from == "objects":
            mask_val = np.random.choice(mask_vals[1:])
        else:
            mask_val = np.random.choice(mask_vals)
        y_coords, x_coords = np.where(masks == mask_val)
        n_options = len(y_coords)
        point_idx = np.random.randint(0, n_options, 1)
        point = (int(x_coords[point_idx]), int(y_coords[point_idx]))
        if point[0] < border_px or point[0] > (mask_shape - border_px) \
            or point[1] < border_px or point[1] > mask_shape - border_px \
            or point in ignore_pts:
            continue

        return point, mask_val


def sample_point_uniform(image_size, border_px=15, ignore_pts=[]):
    """
    Samples point uniformly from an image by choosing unconstrained pixel location
    """
    while True:
        x, y = np.random.randint(border_px, image_size - border_px, 2)
        if x < border_px or x > (image_size - border_px) \
            or y < border_px or y > image_size - border_px \
            or (x, y) in ignore_pts:
            continue
        return (int(x), int(y))


def object_localization_trial(image_idx,
                              familiarization_trial=False,
                              attention_check=False,
                              ignore_pts=[]):
    """
    Format trial for object localization task
    Points are sampled such that they're either on an object or
    background. Ideally points shouldn't be too ambiguous (ie; half
    on an object and half off)

    params:
    --------
    image_idx: int: image index for dataset
    familiarization_trial: bool: whether the trial is a familiarization trial
    attention_check: bool: whether to fetch attention checks
    ignore_pts: list[(int, int)]: list of pixel positions to ignore

    returns:
    ---------
    Dictionary with following fields:
        {imageURL: url,
        probe_touching: True, False
        probe_location: [(x1, y1)],
        mask_val: int (mask value of sampled point),
        gt_bounding_box: [(x1,y1), (x2, y2)],
        }
    """
    if attention_check:
        with open("attention_checks/object-loc.json", "r") as f:
            attention_check_trials = []
            attention_checks = json.load(f)
            for key in attention_checks.keys():
                img_s3_url, probe_location, probe_touching, bbox = attention_checks[key]
                trial_data = {}
                trial_data["imageURL"] = img_s3_url
                trial_data["probeLocation"] = probe_location
                trial_data["probeTouching"] = probe_touching
                trial_data["gtBoundingBox"] = bbox
                trial_data["attentionCheck"] = True
                trial_data["isDuplicate"] = False
                attention_check_trials.append(trial_data)
            return attention_check_trials

    if familiarization_trial:
        s3_dir = S3_TRAIN_ROOT
        image_dir = IMAGE_TRAIN_ROOT
    else:
        s3_dir = S3_ROOT
        image_dir = IMAGE_ROOT

    trial_data = {}
    image_url = os.path.join(s3_dir, "images", f"image_{image_idx:03d}.png")

    meta_path = os.path.join(image_dir, "meta", f"meta_{image_idx:03d}.pkl")
    with open(meta_path, "rb") as f:
        image_metadata = pickle.load(f)

    trial_data["imageMetadata"] = image_metadata
    trial_data["imageURL"] = image_url
    trial_data["attentionCheck"] = False

    if args.dataset in SYNTHETIC_DATASETS:
        mask_path = os.path.join(image_dir, "masks", f"mask_{image_idx:03d}.png")
        masks = np.array(Image.open(mask_path).convert("L"))
        image_size = masks.shape[0]
        sample_from = "background" if image_idx % 2 == 0 else "objects"
        probe_location, mask_val = sample_point_from_masks(masks, ignore_pts=ignore_pts, sample_from=sample_from)
        bbox = get_bounding_box_from_mask(masks, mask_val)
        trial_data["gtBoundingBox"] = bbox
        trial_data["probeTouching"] = False if image_idx % 2 == 0 else True
    elif familiarization_trial:
        # Familiarization trials for natural datasets requires hand annotated ground truth
        fam_trials = json.load(open(f"additional/{args.dataset}_object-loc.json", "r"))
        probe_location, probe_touching, bbox = fam_trials[str(image_idx)]
        trial_data["gtBoundingBox"] = bbox
        trial_data["probeTouching"] = probe_touching
    else:
        # Sample points uniformly for naturalistic test trials
        image_size = 512
        probe_location = sample_point_uniform(image_size, ignore_pts=ignore_pts)

    trial_data["probeLocation"] = probe_location
    trial_data["isDuplicate"] = False
    trial_data["attentionCheck"] = False
    trial_data = denumpy_dictionary(trial_data)
    return trial_data, probe_location


def two_point_segmentation_trial(image_idx,
                                 familiarization_trial=False,
                                 attention_check=False,
                                 ignore_pts=[]):
    """
    Format trial for two point segmentation task
    Points are sampled such that they're either on the same object or
    two different objects. They should be controlled for distance.
    ie; for every `same` trial where the 2 points are distance X from
    each other, there should be a `different` trial where the 2 points
    are an equivalent distance.

    One option is to sample points from a circle of radius X. Sampling
    should be done in object mask space, to check if the 2nd point lies
    on another object (except for hypersim, which has panoptic segmentation masks)

    params:
    --------
    image_idx: int: image index for dataset
    familiarization_trial: bool: whether the trial is a familiarization trial
    attention_check: bool: whether to fetch attention checks
    ignore_pts: list[(int, int)]: list of pixel positions to ignore

    returns:
    ---------
    Dictionary with following fields:
        {imageURL: url,
        probe_locations: [(x1, y1), (x2, y2)],
        probe_ids: [d1, d2] segmentation ID id for each point (if relevant)
        same_object: [True, False]
        }
    """
    if familiarization_trial:
        s3_dir = S3_TRAIN_ROOT
        image_dir = IMAGE_TRAIN_ROOT
    else:
        s3_dir = S3_ROOT
        image_dir = IMAGE_ROOT

    if attention_check:
        with open("attention_checks/depth.json", "r") as f:
            attention_check_trials = []
            attention_checks = json.load(f)
            for key in attention_checks.keys():
                img_s3_url, points, correct_idx, correct_point = attention_checks[key]
                trial_data = {}
                trial_data["imageURL"] = img_s3_url
                trial_data["probeLocations"] = points
                trial_data["correctChoice"] = correct_idx
                trial_data["attentionCheck"] = True
                trial_data["isDuplicate"] = False
                trial_data = denumpy_dictionary(trial_data)
                attention_check_trials.append(trial_data)

    trial_data = {}
    image_url = os.path.join(s3_dir, "images", f"image_{image_idx:03d}.png")

    meta_path = os.path.join(image_dir, "meta", f"meta_{image_idx:03d}.pkl")
    with open(meta_path, "rb") as f:
        image_metadata = pickle.load(f)

    trial_data["imageMetadata"] = image_metadata
    trial_data["imageURL"] = image_url
    trial_data["attentionCheck"] = False

    def generate_point_pair(ignore_pts=[], same_object=False, max_radius=50, masks=None, image_size=None):
        """
        params:
            ignore_pts: list[tuple[int, int]]: list of points to ignore
            same_object:bool: whether to sample points on the same object
            max_radius: how far away to sample alternate probe
            masks: np.ndarray: array of masks
            image_size: int: in case masks not present
        """
        if masks == None:   # No ground truth for dataset
            x1 = np.random.randint(0, image_size)
            y1 = np.random.randint(0, image_size)
            while (x1, y1) in ignore_pts:
                x1 = np.random.randint(0, image_size)
                y1 = np.random.randint(0, image_size)

            x2 = np.random.randint(x-max_radius, x+max_radius)
            y2 = np.random.randint(y-max_radius, y+max_radius)
            return [(x1, y1), (x2, y2)]

        mask_ids = np.unique(masks)
        probe_id = np.random.choice(mask_ids)
        y_opts, x_opts = np.where(masks == probe_id)


def depth_estimation_trial(image_idx,
                           familiarization_trial=False,
                           attention_check=False,
                           ignore_pts=[]):
    """
    Format trial for depth estimation experiment
    Points are sampled across a horizontal axis
    params:
    --------
    image_idx: int: image index for dataset
    familiarization_trial: bool: whether the trial is a familiarization trial
    ignore_pts: list[(int, int)]: list of pixel positions to ignore

    returns:
    ---------
    Dictionary with following fields:
        {imageURL: url,
        probe_locations: [(x1, y1), (x2, y2)],
        true_depths: [d1, d2] depth of each point (if relevant)
        correct_choice: choice of [0, 1, 2] <- left closer, right closer, same
        }
        and sampled points
    """
    if familiarization_trial:
        s3_dir = S3_TRAIN_ROOT
        image_dir = IMAGE_TRAIN_ROOT
    else:
        s3_dir = S3_ROOT
        image_dir = IMAGE_ROOT

    if attention_check:
        with open("attention_checks/depth.json", "r") as f:
            attention_check_trials = []
            attention_checks = json.load(f)
            for key in attention_checks.keys():
                img_s3_url, points, correct_idx, correct_point = attention_checks[key]
                trial_data = {}
                trial_data["imageURL"] = img_s3_url
                trial_data["probeLocations"] = points
                trial_data["correctChoice"] = correct_idx
                trial_data["attentionCheck"] = True
                trial_data["isDuplicate"] = False
                trial_data = denumpy_dictionary(trial_data)
                attention_check_trials.append(trial_data)

        return attention_check_trials

    trial_data = {}
    image_url = os.path.join(s3_dir, "images", f"image_{image_idx:03d}.png")

    meta_path = os.path.join(image_dir, "meta", f"meta_{image_idx:03d}.pkl")
    with open(meta_path, "rb") as f:
        image_metadata = pickle.load(f)

    trial_data["imageMetadata"] = image_metadata
    trial_data["imageURL"] = image_url
    trial_data["attentionCheck"] = False

    def generate_point_pair(point_a, image_size, ignore_pts=[]):
        """
        generate a point across a horizontal line of some distance
        """
        x, y = point_a
        midpoint = image_size // 2
        buffer_size = 15 # stay 15px away from border

        while True:
            if x < midpoint:
                x2 = int(np.random.randint(x + buffer_size, image_size - buffer_size))
                if (x2, y) in ignore_pts:
                    continue
                points = [point_a, (x2, y)]
            elif x > midpoint:
                x2 = int(np.random.randint(buffer_size, x - buffer_size))
                if (x2, y) in ignore_pts:
                    continue
                points = [(x2, y), point_a]
            else:
                x2 = int(np.random.randint(midpoint + buffer_size, image_size - buffer_size))
                if (x2, y) in ignore_pts:
                    continue
                points = [point_a, (x2, y)]

            return points

    if args.dataset in SYNTHETIC_DATASETS:
        mask_path = os.path.join(image_dir, "masks", f"mask_{image_idx:03d}.png")
        masks = np.array(Image.open(mask_path).convert("L"))
        image_size = masks.shape[0]
        point_1, mask_val = sample_point_from_masks(masks, ignore_pts=ignore_pts) # x, y point
        probe_locations = generate_point_pair(point_1, image_size)

        # Add ground truth normals
        depth_data_path = os.path.join(image_dir, "depths", f"depth_{image_idx:03d}.hdf5")
        with h5py.File(depth_data_path, "r") as f:
            depth_data = f["dataset"][:]

        left, right = probe_locations
        gt_depths = [depth_data[left[1], left[0]], depth_data[right[1], right[0]]]

        # Determine closer point
        if gt_depths[0] < gt_depths[1]:
            correct_choice = 0
        elif gt_depths[0] > gt_depths[1]:
            correct_choice = 1
        else:
            correct_choice = 2

        trial_data["gtDepths"] = gt_depths
        trial_data["correctChoice"] = correct_choice
    elif familiarization_trial:
        fam_trials = json.load(open(f"additional/{args.dataset}_depths.json", "r"))
        probe_locations, correct_choice = fam_trials[str(image_idx)]
        trial_data["correctChoice"] = correct_choice
    else:
        image_size = 512
        point_1 = sample_point_uniform(image_size, ignore_pts=ignore_pts)
        probe_locations = generate_point_pair(point_1, image_size)

    trial_data["probeLocations"] = probe_locations
    trial_data["isDuplicate"] = False
    trial_data["attentionCheck"] = False
    trial_data = denumpy_dictionary(trial_data)
    return trial_data, probe_locations

def surface_normal_trial(image_idx,
                         familiarization_trial=False,
                         attention_check=False,
                         ignore_pts=[]):
    """
    Formats a trial for surface normal experiment.
    params:
    --------
    image_idx: int: image index for dataset
    familiarization_trial: bool: whether the trial is a familiarization trial
    ignore_pts: list[(int, int)]: list of pixel positions to ignore

    returns:
    --------
    Generate dictionary with following fields:
        {imageURL: url
        isDuplicate: True if duplicate
        randomizeArrowInitialDirection: True
        arrowPixelPosition: (x, y) location
        trueArrowDirection: present if synth dataset
        arrowPosition: normalized coords for pixel (width / 100)
        trialType: [supervised, unsupervised, reinforcement]
        }

    returns `trial` and `probe_location`
    """
    if familiarization_trial:
        s3_dir = S3_TRAIN_ROOT
        image_dir = IMAGE_TRAIN_ROOT
    else:
        s3_dir = S3_ROOT
        image_dir = IMAGE_ROOT

    if attention_check:
        with open("attention_checks/surface_normals.json", "r") as f:
            attention_checks = json.load(f)
            attention_check_trials = []
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
                trial_data["attentionCheck"] = True
                trial_data["trialType"] = "unsupervised"
                trial_data["isDuplicate"] = False
                trial_data = denumpy_dictionary(trial_data)
                attention_check_trials.append(trial_data)

            return attention_check_trials

    trial_data = {}
    image_url = os.path.join(s3_dir, "images", f"image_{image_idx:03d}.png")

    meta_path = os.path.join(image_dir, "meta", f"meta_{image_idx:03d}.pkl")
    with open(meta_path, "rb") as f:
        image_metadata = pickle.load(f)

    trial_data["imageMetadata"] = image_metadata
    trial_data["imageURL"] = image_url
    trial_data["trialType"] = "unsupervised"

    if args.dataset in SYNTHETIC_DATASETS:
        mask_path = os.path.join(image_dir, "masks", f"mask_{image_idx:03d}.png")
        masks = np.array(Image.open(mask_path).convert("L"))
        image_size = masks.shape[0]
        if args.dataset == "gestalt_shapegen":
            sample_from = "objects"
        else:
            sample_from = ""
        point, mask_val = sample_point_from_masks(masks, ignore_pts=ignore_pts, sample_from=sample_from) # x, y point

        # Add ground truth normals
        normal_data_path = os.path.join(image_dir, "normals", f"normal_{image_idx:03d}.hdf5")
        with h5py.File(normal_data_path, "r") as f:
            normal_data = f["dataset"][:]

        x, y = point
        gt_normals = normal_data[y, x]
        trial_data["trueArrowDirection"] = gt_normals
    elif familiarization_trial:
        fam_trials = json.load(open(f"additional/{args.dataset}_normals.json", "r"))
        point, gt_normals = fam_trials[str(image_idx)]
        trial_data["trueArrowDirection"] = gt_normals
        if image_idx >= 2:
            trial_data["trialType"] = "reinforcement"
        else:
            trial_data["trialType"] = "supervised"
    else:
        image_size = 512
        point = sample_point_uniform(image_size, ignore_pts=ignore_pts)

    x, y = point
    canvas_size = image_size / 100
    arrow_NDC = [map_range(x, 0, image_size - 1, -canvas_size, canvas_size),
                 map_range(y, 0, image_size - 1, -canvas_size, canvas_size),
                 0]

    trial_data["isDuplicate"] = False
    trial_data["arrowPosition"] = arrow_NDC
    trial_data["arrowPixelPosition"] = point
    trial_data["randomizeArrowInitialDirection"] = True
    trial_data = denumpy_dictionary(trial_data)
    return trial_data, point


def setup_experiment(n_images, n_batches, n_repeats=10, repeat_times=3, render_points=True):
    if args.dataset not in SYNTHETIC_DATASETS and \
    not os.path.exists(f"additional/{args.dataset}_depths.json"):
        print(f"Expected familiarization trial data for {args.dataset} at path: " + \
              "`additional/{args.dataset}_depths.json`")
        sys.exit(1)

    if args.experiment_type == "surface-normals":
        setup_experiment_trial = surface_normal_trial
    elif args.experiment_type == "depth-estimation":
        setup_experiment_trial = depth_estimation_trial
    elif args.experiment_type == "object-loc":
        setup_experiment_trial = object_localization_trial
    # main experiment batches
    batches = [[] for batch in range(n_batches)]
    render_point_path = os.path.join(IMAGE_ROOT + "-sampled-points", args.dataset + "_" + args.experiment_type)
    os.makedirs(render_point_path, exist_ok=True)

    print("Generating " + args.experiment_type + " experimental trials...")
    for image_idx in tqdm(range(n_images)):
        ignore_points = []
        image_path = os.path.join(IMAGE_ROOT, "images", f"image_{image_idx:03d}.png")
        image_draw = cv2.imread(image_path)

        for batch_idx in range(n_batches):
            trial_data, sampled_point = setup_experiment_trial(image_idx, ignore_pts=ignore_points)
            if args.experiment_type == "depth-estimation":
                ignore_points.append(sampled_point[0])
                ignore_points.append(sampled_point[1])
            else:
                ignore_points.append(sampled_point)

            trial_data["attentionCheck"] = False
            trial_data["batchIdx"] = batch_idx
            batches[batch_idx].append(trial_data)

            if render_points:
                if args.experiment_type == "depth-estimation":
                    color = [int(x) for x in np.random.randint(0, 255, 3)]
                    for point in sampled_point:
                        image_draw = cv2.circle(image_draw, (point[0], point[1]), 7, color, -1)
                        image_draw = cv2.circle(image_draw, (point[0], point[1]), 7, (0, 0, 0), 1)
                        image_draw = cv2.putText(image_draw, f"{batch_idx}", (point[0] - 4, point[1] + 4),
                                                 cv2.FONT_HERSHEY_PLAIN, 0.5, (0, 0, 0), 1)
                else:
                    image_draw = cv2.circle(image_draw, (sampled_point[0], sampled_point[1]), 7, (25, 25, 255), -1)
                    image_draw = cv2.circle(image_draw, (sampled_point[0], sampled_point[1]), 7, (0, 0, 0), 1)
                    image_draw = cv2.putText(image_draw, f"{batch_idx}", (sampled_point[0] - 4, sampled_point[1] + 4),
                                             cv2.FONT_HERSHEY_PLAIN, 0.5, (0, 0, 0), 1)

        if render_points:
            render_path = os.path.join(render_point_path, f"point_{image_idx:03d}.png")
            tqdm.write("Writing image with rendered points to path: " + render_path)
            cv2.imwrite(render_path, image_draw)

    # Generate familiarization trials
    familiarization_trials = []
    print("Generating familiarization trials")
    for image_idx in range(5):
        trial_data, sampled_point = setup_experiment_trial(image_idx, familiarization_trial=True)
        trial_data["attentionCheck"] = False
        familiarization_trials.append(trial_data)

    # Depth Attention Checks
    print("Generating attention check trials")
    attention_checks = setup_experiment_trial(0, attention_check=True)
    for i, batch in enumerate(batches):
        for attention_check in attention_checks:
            attention_check["batchIdx"] = i
            batch.append(attention_check)

    return batches, familiarization_trials

def repeat_trials(batches, n_repeats, repeat_times, n_attention_checks=5):
    """
    Repeats some trials
    params:
    -----
    batches: list[list[dict]] list of all the batches
    n_repeats: int: how many trials to repeat
    repeat_times: int: how many times to repeat each trial
    n_attention_checks: int: how many attention checks exist -- assumes they're all
                            the last trials in the batch list
    returns:
    -------
    batches with repeat trials added in
    """
    n_trials = len(batches[0])
    for batch in batches:
        repeat_trial_idxs = list(np.random.choice(range(n_trials - n_attention_checks), n_repeats, replace=False))
        repeat_trials = [batch[idx] for idx in repeat_trial_idxs]
        for og_trial in repeat_trials:
            repeat_trial = og_trial.copy()
            repeat_trial["isDuplicate"] = True
            for _ in range(repeat_times):
                batch.append(repeat_trial)
    return batches

def generate_experiment_trials():
    conn = cabutils.get_db_connection()

    proj_name = "mlve"
    exp_name = args.dataset + "-" + args.experiment_type
    if args.experiment_name_addons:
        exp_name = exp_name + "-" + args.experiment_name_addons
    iter_name = args.iter_name
    metadata = {"proj_name": "mlve", "exp_name": exp_name, "iter_name": args.iter_name}

    print("Generating Experiment trials: ", metadata)
    db = conn[proj_name + "_inputs"]
    col = db[exp_name]
    print("Dropping old results")
    col.drop()

    n_repeats = 10
    repeat_times = 3

    # Setup experiment
    batches, familiarization_trials = setup_experiment(n_images=100, n_batches=args.n_batches)
    # Add repeat trials
    batches = repeat_trials(batches, n_repeats, repeat_times)

    for i, batch in enumerate(batches):
        metadata["batch_idx"] = i
        data = {"metadata": metadata,
                "trials": batch,
                "familiarization_trials": familiarization_trials,
                "iterName": iter_name,
                "batch_id": str(i)}
        res = col.insert_one({"data": data})
        print("Sent data to MongoDB store: ", res)


generate_experiment_trials()
