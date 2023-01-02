import os
import sys
import cv2
import h5py
import json
import random
import pickle
import datetime
import numpy as np
from glob import glob
from tqdm import tqdm
from PIL import Image
from skimage import segmentation
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
parser.add_argument("--batch_dir", type=str, required=True)
parser.add_argument("--n_batches", type=int, default=100)
parser.add_argument("--project", type=str, default="mlve")
parser.add_argument("--notes", type=str, default="")
args = parser.parse_args()

SYNTHETIC_DATASETS = ["gestalt", "gestalt_shapegen", "hypersim_v2", "hypersim_v3", "tdw"]
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
        elif type(v) == np.int64:
            dictionary[k] == int(v)
        elif type(v) == list and len(v) > 0 and type(v[0]) == np.float32:
            dictionary[k] = [float(x) for x in v]
        elif type(v) == list and len(v) > 0 and type(v[0]) == np.int64:
            dictionary[k] = [int(x) for x in v]
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


def points_on_radius(radius, x0, y0, n_points=100):
    points = []
    for x in range(n_points):
        x = int(x0 + np.cos(2 * np.pi / n_points * x) * radius)
        y = int(y0 + np.sin(2 * np.pi / n_points * x) * radius)
        points.append((x, y))
    return points

def points_in_circle(radius, x0=0, y0=0):
    """
    returns points in a circle with a given radius, centered at x0, y0
    """
    xs = np.arange(x0 - radius - 1, x0 + radius + 1, dtype=int)
    ys = np.arange(y0 - radius - 1, y0 + radius + 1, dtype=int)
    x, y = np.where((xs[:,np.newaxis] - x0)**2 + (ys - y0)**2 <= radius**2)
    for x, y in zip(xs[x], ys[y]):
        yield x, y

def check_overlap(point, border_dist, mask, overlap_threshold=25):
    """
    Check if a point is too close to the image border or if the probe overlaps too much
    with the wrong object
    """
    width = mask.shape[0]
    radius = 10
    if point[0] < border_dist or point[1] < border_dist \
        or point[0] > width - border_dist or point[1] > width - border_dist:
        return True

    mask_val = mask[point[1], point[0]]
    overlaps = 0

    for x_t, y_t in points_in_circle(radius=radius, x0=point[0], y0=point[1]):
        if x_t > (width - border_dist) or y_t > (width - border_dist) \
                or x_t < border_dist or y_t < border_dist:
            return True

        if mask[y_t, x_t] != mask_val:
            overlaps += 1
            if overlaps > overlap_threshold:
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
    max_tries = 100
    tries = 0
    while True:
        if sample_from == "background":
            mask_val = mask_vals[0]
        elif sample_from == "objects":
            mask_val = np.random.choice(mask_vals[1:])
        else:
            mask_val = np.random.choice(mask_vals)
        y_coords, x_coords = np.where(masks == mask_val)
        n_options = len(y_coords)
        point_idx = np.random.randint(0, n_options, 1)
        point = (int(x_coords[point_idx]), int(y_coords[point_idx]))
        tries += 1
        if tries == max_tries:
            return point, mask_val

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


def sample_points_unbiased(mask, min_dist=20, max_dist=100, max_tries=20, background_id=0, ignore_pts=[]):
    """
    Samples two points from image masks so that the distance between
    the points is uncorrelated to whether the two points are on the
    same object or different.

    To do this, we sample an initial point on an object,
    and then choose two equidistant points such that
    one point is on the same object and one point is not.

    Params:
        mask (np.array): masks for a given image
        min_dist (int): minimum distance between points
        max_dist (int): maximum distance between points
        max_tries (int): maximum number of tries to find a set of
                         points that fit the constraints
        background_id (int): mask ID of the background
        ignore_pts: (list): list of (x, y) tuples containing list of points already sampled

    Returns:
        Set of three points (base, off, on) and the mask ID of the base point
        All points are stored as (x, y) pairs

        If no set of points can be found within the
        max number of tries, returns an empty list
    """
    mask_y, mask_x = np.where(mask != background_id)
    masked_points = list(zip(mask_x, mask_y))
    tries = 0
    while tries < max_tries:
        point_idx = np.random.choice(range(len(masked_points)))
        x0 = masked_points[point_idx][0]
        y0 = masked_points[point_idx][1]

        while (x0, y0) in ignore_pts:
            point_idx = np.random.choice(range(len(masked_points)))
            x0 = masked_points[point_idx][0]
            y0 = masked_points[point_idx][1]

        base_id = mask[y0, x0]
        dist = np.random.uniform(min_dist, max_dist)

        # Generate a circle with center at (x0, y0)
        # and sort which points are on / off the initial point
        radial_points = points_on_radius(dist, x0, y0, n_points=20)

        on_object = []
        off_object = []
        for i, (px, py) in enumerate(radial_points):
            if (px >= mask.shape[1] or px < 0 or py >= mask.shape[0] or py < 0):
                continue

            radial_id = mask[py, px]
            if radial_id == base_id:
                on_object.append((px, py))
            else:
                off_object.append((px, py))

        if len(off_object) > 0 and len(on_object) > 0:
            off_point = off_object[np.random.choice(range(len(off_object)))]
            on_point = on_object[np.random.choice(range(len(on_object)))]
            base = (int(x0), int(y0))
            return base, [int(p) for p in off_point], [int(p) for p in on_point], int(base_id)

        # Otherwise we haven't found a point and should
        # sample again
        tries += 1

    # There's probably a better way to handle this case
    return None, None, None, None

def object_localization_trial(args, image_idx,
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

def get_border_pixel_coords(masked_image):
    """
    Returns list of pixel coords for boundary of a given mask id
    """
    border_pixels = segmentation.find_boundaries(masked_image)
    y, x = np.where(border_pixels)
    border_coords = [(x[i], y[i]) for i in range(len(y))]
    return border_coords

def l2_distance(p1, p2):
    return np.sqrt(np.sum([(p1[i] - p2[i]) ** 2 for i in range(2)]))

def get_nearest_boundary_point(masked_image, origin):
    boundary_points = get_border_pixel_coords(masked_image)
    dists = []
    for b in boundary_points:
        dists.append(l2_distance(b, origin))

    min_dist = min(dists)
    min_dist_idx = dists.index(min_dist)
    point = boundary_points[min_dist_idx]
    return point

def generate_point_pair(ignore_pts=[], trial_same_object=True, min_radius=25, max_radius=100, masks=None, image_size=None):
    """
    Returns two points:
        Samples first point on an arbitrary mask. To sample the second one, draw a circle of randomly sampled radius
        around the first point. If trial_same_object==True, the second point will be sampled such that it has the same
        MASK ID.
    params:
        ignore_pts: list[tuple[int, int]]: list of points to ignore
        same_object:bool: whether to sample points on the same object
        max_radius: how far away to sample alternate probe
        masks: np.ndarray: array of masks
        image_size: int: in case masks not present
    """
    if not args.dataset in SYNTHETIC_DATASETS and args.dataset != "nsd":   # No ground truth for dataset
        x1 = int(np.random.randint(0, image_size))
        y1 = int(np.random.randint(0, image_size))
        while (x1, y1) in ignore_pts:
            x1 = int(np.random.randint(0, image_size))
            y1 = int(np.random.randint(0, image_size))

        radius = np.random.randint(min_radius, max_radius)
        radial_points = points_on_radius(radius, x1, y1)
        (x2, y2) = np.random.choice(radial_points, 1, replace=False)
        return (x1, y1), (x2, y2)
    else:
        if args.dataset == "nsd":
            background_id = 30
        else:
            background_id = 0

        mask_ids = [x for x in np.unique(masks) if x != background_id] # Pick object from non-background mask ids
        # repeat this process until we find a good pair of points

        max_tries = 100
        tries = 0
        overlap_threshold = 25
        while True:
            tries += 1
            probe_ids = []
            # Choose an initial mask ID
            probe_id = np.random.choice(mask_ids)
            probe_ids.append(int(probe_id))

            masked_image = (masks == probe_id)
            y_opts, x_opts = np.where(masked_image) # get masked indices
            mask_points = [(int(x_opts[i]), int(y_opts[i])) for i in range(len(y_opts))]  # arrange them in (x,y) format

            # Sample first point
            point_found = False
            for _ in range(len(mask_points)):
                p1 = mask_points[np.random.randint(len(mask_points))]
                # Make sure first point isn't too close to the edge
                # print("Checking overlap for point: ", p1)
                probe_overlap = check_overlap(p1, 15, masks, overlap_threshold=overlap_threshold)

                if not probe_overlap:
                    point_found = True
                    break

            if not point_found:
                if tries == max_tries:
                    print("UNABLE TO FIND A POINT PAIR")

                overlap_threshold += 5
                continue

            # Sample second point
            radius = np.random.randint(min_radius, max_radius)
            circle_points = points_on_radius(radius, p1[0], p1[1])
            probe_opts = []
            for point in circle_points:
                # Ignore points that fall outside image boundaries
                px, py = point
                probe_overlap = check_overlap(point, 15, masks, overlap_threshold=overlap_threshold)
                if probe_overlap:
                    overlap_threshold += 5
                    continue

                if not trial_same_object and masks[py, px] != probe_id:
                    probe_opts.append(point)
                elif trial_same_object and masks[py, px] == probe_id:
                    probe_opts.append(point)

            if len(probe_opts) == 0:
                print(".", end="")
                continue

            p2 = probe_opts[np.random.choice(len(probe_opts))]
            p2_id = int(masks[p2[1], p2[0]])
            probe_ids.append(p2_id)
            return (p1, p2), probe_ids

def two_point_segmentation_trial(args, image_idx,
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
        probe_ids: [d1, d2] segmentation ID for each point (if relevant)
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
                img_s3_url, points, correct_depth, correct_segmentation = attention_checks[key]
                trial_data = {}
                trial_data["imageURL"] = img_s3_url
                trial_data["probeLocations"] = points
                trial_data["correct_segmentation"] = correct_segmentation
                trial_data["correct_depth"] = correct_depth
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

    if args.dataset in SYNTHETIC_DATASETS or (args.dataset == "nsd" and not familiarization_trial):
        mask_path = os.path.join(image_dir, "masks", f"mask_{image_idx:03d}.png")
        masks = np.array(Image.open(mask_path).convert("L"))
        trial_same_object = True if image_idx % 2 == 0 else False
        base, off, on, probe_ids = sample_points_unbiased(masks, ignore_pts=ignore_pts)
        if trial_same_object:
            probe_locations = [base, on]
        else:
            probe_locations = [base, off]

        #probe_locations, probe_ids = generate_point_pair(ignore_pts=ignore_pts, trial_same_object=trial_same_object,  min_radius=25, max_radius=150, masks=masks)

        # Get Depth
        if args.dataset != "nsd":
            depth_data_path = os.path.join(image_dir, "depths", f"depth_{image_idx:03d}.hdf5")
            with h5py.File(depth_data_path, "r") as f:
                depth_data = f["dataset"][:]

            left, right = probe_locations
            gt_depths = [depth_data[left[1], left[0]], depth_data[right[1], right[0]]]

            # Determine closer point
            if gt_depths[0] <= gt_depths[1]:
                correct_depth = 0
            else:
                correct_depth = 1

            trial_data["correct_depth"] = correct_depth
            trial_data["gt_depth"] = gt_depths

        trial_data["sameObj"] = True if trial_same_object else False
        trial_data["probeIDs"] = probe_ids
        trial_data["correct_segmentation"] = 1 if trial_same_object else 0

    if args.dataset == "nsd" and familiarization_trial:
        print("Loading familiarization trials: ")
        fam_trials = json.load(open(f"additional/{args.dataset}_segmentation.json", "r"))
        probe_locations, correct_segmentation, correct_depth = fam_trials[str(image_idx)]
        trial_data["correct_segmentation"] = correct_segmentation
        trial_data["correct_depth"] = correct_depth

    # elif not args.dataset == "nsd":
    #     image_size = 512
    #     probe_locations = generate_point_pair(ignore_pts=ignore_pts, image_size=image_size, min_radius=15, max_radius=100)

    trial_data["probeLocations"] = probe_locations
    trial_data["isDuplicate"] = False
    trial_data["attentionCheck"] = False
    trial_data = denumpy_dictionary(trial_data)
    return trial_data, probe_locations

def depth_estimation_trial(args, image_idx,
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
        point_1, mask_val = sample_point_from_masks(masks, ignore_pts=ignore_pts, sample_from="objects") # x, y point
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

def surface_normal_trial(args, image_idx,
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
        image_metadata = denumpy_dictionary(image_metadata)

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

        use_mask_val = False
        if use_mask_val:
            point, mask_val = sample_point_from_masks(masks, ignore_pts=ignore_pts, sample_from=sample_from) # x, y point

        # Add ground truth normals
        normal_data_path = os.path.join(image_dir, "normals", f"normal_{image_idx:03d}.hdf5")
        with h5py.File(normal_data_path, "r") as f:
            normal_data = f["dataset"][:]

        if use_mask_val:
            mask_y, mask_x = np.where(masks == mask_val)  # Sample pixel from object
        else:
            mask_y, mask_x = np.where(masks > 0)  # Sample pixel from object


        mask_normals = normal_data[mask_y, mask_x, :]   # Get normals from object

        if use_mask_val:
            unique_normals = np.unique(mask_normals, axis=0) # Get unique normals
            unique_normals = unique_normals[~np.isnan(unique_normals).any(axis=1)]
            rng = np.random.default_rng()
            normal_val = rng.choice(unique_normals)   # Sample normal value randomly
            mask_indexes = np.where((mask_normals == normal_val).all(axis=1))[0]  # Get mask indexes for the selected normals
            if len(mask_indexes) > 0:
                # Something is broken in this case lol
                import pdb
                pdb.set_trace()
        else:
            def l2_dist(a, b):
                dist = np.linalg.norm(a - b, axis=1)
                return dist

            while True:
                normal_val = np.random.randn(1, 3)
                normal_val /= np.linalg.norm(normal_val, axis=1)
                # Make sure z is > 0
                if normal_val[:, -1] > 0:
                    # Get mask indexes for selected normal val
                    dists = l2_dist(mask_normals, normal_val)
                    mask_indexes = np.where((dists < 0.1))[0]
                    # If there are no matching surface normals, resample
                    if len(mask_indexes) > 0:
                        # Otherwise we're done
                        break

            normal_val = normal_val[0]

        point_idx = np.random.choice(mask_indexes) # Pick the index of the pixel to sample
        point = (int(mask_x[point_idx]), int(mask_y[point_idx])) # points are stored as x, y
        trial_data["trueArrowDirection"] = [float(x) for x in normal_val]

    elif familiarization_trial:
        fam_trials = json.load(open(f"additional/{args.dataset}_surface-normals.json", "r"))
        point, gt_normals = fam_trials[str(image_idx)]
        trial_data["trueArrowDirection"] = gt_normals
        if image_idx >= 2:
            trial_data["trialType"] = "reinforcement"
        else:
            trial_data["trialType"] = "supervised"
    else:
        if args.dataset == "nsd":
            mask_path = os.path.join(image_dir, "masks", f"mask_{image_idx:03d}.png")
            masks = np.array(Image.open(mask_path).convert("L"))
            image_size = masks.shape[0]
            sample_from = "objects" if np.random.rand() > 0.1 else "background"
            point, mask_val = sample_point_from_masks(masks, ignore_pts=ignore_pts, sample_from=sample_from) # x, y point
        else:
            image_size = 512
            point = sample_point_uniform(image_size, ignore_pts=ignore_pts)

    x, y = point
    if args.dataset == "nsd":
        image_size = 425
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


def setup_experiment(args, n_images, n_batches, n_repeats=10, repeat_times=3, render_points=False):
    if args.dataset not in SYNTHETIC_DATASETS and \
            not os.path.exists(f"additional/{args.dataset}_{args.experiment_type}.json"):
        print(f"Expected familiarization trial data for {args.dataset} at path: " + \
              "`additional/{args.dataset}_{args.dataset}.json`")
        sys.exit(1)

    if args.experiment_type == "surface-normals":
        setup_experiment_trial = surface_normal_trial
    elif args.experiment_type == "depth-estimation":
        setup_experiment_trial = depth_estimation_trial
    elif args.experiment_type == "object-loc":
        setup_experiment_trial = object_localization_trial
    elif args.experiment_type == "segmentation":
        setup_experiment_trial = two_point_segmentation_trial

    # main experiment batches
    batches = [[] for batch in range(n_batches)]
    render_point_path = os.path.join(IMAGE_ROOT + "-sampled-points", args.dataset + "_" + args.experiment_type)
    os.makedirs(render_point_path, exist_ok=True)

    for image_idx in tqdm(range(n_images)):
        ignore_points = []
        image_path = os.path.join(IMAGE_ROOT, "images", f"image_{image_idx:03d}.png")
        image_draw = cv2.imread(image_path)

        for batch_idx in range(n_batches):
            trial_data, sampled_point = setup_experiment_trial(args, image_idx, ignore_pts=ignore_points)
            if args.experiment_type == "depth-estimation":
                ignore_points.append(sampled_point[0])
                ignore_points.append(sampled_point[1])
            else:
                ignore_points.append(sampled_point)

            trial_data["attentionCheck"] = False
            trial_data["batchIdx"] = batch_idx
            batches[batch_idx].append(trial_data)

            if render_points:
                if args.experiment_type == "depth-estimation" or args.experiment_type == "segmentation":
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
        trial_data, sampled_point = setup_experiment_trial(args, image_idx, familiarization_trial=True)
        trial_data["attentionCheck"] = False
        familiarization_trials.append(trial_data)

    # Depth Attention Checks
    print("Generating attention check trials")
    attention_checks = setup_experiment_trial(args, 0, attention_check=True)
    for i, batch in enumerate(batches):
        for attention_check in attention_checks:
            attention_check["batchIdx"] = i

    return batches, familiarization_trials, attention_checks

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
        repeat_trials_list = [batch[idx] for idx in repeat_trial_idxs]
        for og_trial in repeat_trials_list:
            repeat_trial = og_trial.copy()
            repeat_trial["isDuplicate"] = True
            for _ in range(repeat_times):
                batch.append(repeat_trial)
    return batches

def assign_time_constraints(trials, time_constraints):
    """
    Generates batches of trials with different time constraints
    Sets up a within-subject split of time constraints,
    so that each subject sees an even split of all available time constraints (but on different trials)
    """
    from collections import deque
    time_constraints = deque(time_constraints)
    n_constraints = len(time_constraints)
    n_trials = len(trials)
    trials_per_constraint = n_trials // n_constraints
    batches = [[] for _ in range(n_constraints)]
    for i, batch in enumerate(batches):
        for j, trial in enumerate(trials):
            time_constraint_idx = j // trials_per_constraint
            trial["viewing_time"] = time_constraints[time_constraint_idx]
            batch.append(trial)
        time_constraints.rotate(1)
    return batches

def generate_experiment_trials(args):
    proj_name = "mlve"
    exp_name = args.dataset + "-" + args.experiment_type
    if args.experiment_name_addons:
        exp_name = exp_name + "-" + args.experiment_name_addons

    # Setup experiment
    batches, familiarization_trials, attention_checks = setup_experiment(args, n_images=100, n_batches=args.n_batches)

    if args.experiment_type == "surface-normals":
        # Split up batches in surface normal experiments so people only do 50 trials
        new_batches = []
        for batch in batches:
            new_batch = []
            for i in range(2):
                start_idx = i * 50
                half_batch = batch[start_idx : start_idx + 50]
                new_batches.append(half_batch)

        batches = new_batches

    if args.experiment_type == "segmentation":
        # Add time constraints
        time_constraints = [200, 300, 400, 500]
        batches = assign_time_constraints(batches[0], time_constraints)

    # Add repeat trials
    n_repeats = 10
    repeat_times = 3
    # batches = repeat_trials(batches, n_repeats, repeat_times)

    creation_date = f"{datetime.datetime.now():%Y-%d-%m, %HH:%M:%S}"
    save_path = f"datasets/{exp_name}/{args.batch_dir}"
    os.makedirs(save_path, exist_ok=True)

    for i, batch in enumerate(batches):
        for check in attention_checks:
            batch.append(check)

        np.random.shuffle(batch)
        batch_id = batch[0]["batchIdx"]
        data = {"trials": batch,
                "familiarization_trials": familiarization_trials,
                "notes": args.notes,
                "creation_date": creation_date,
                "batch_id": batch_id}
        # res = col.insert_one({"data": data})
        save_file = os.path.join(save_path, f"batch_{i}.json")
        with open(save_file, "w", encoding='utf-8') as f:
            json.dump(data, f)
        print("Wrote data to path: ", save_file)


if __name__=="__main__":
    generate_experiment_trials(args)
