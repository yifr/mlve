import os
import sys
import json
import pickle
import numpy as np
import pandas as pd

from tqdm import tqdm
from glob import glob
from PIL import Image

sys.path.append("../")
import tdw_dataset

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
    mask = np.where(masks == mask_val, masks, 0)
    y, x = np.where(masks == mask_val)
    return y, x, mask, mask_val, mask_idx

def generate_probe_location(masks, probe_touching):
    location_found = False
    if not probe_touching:
        mask_val = 0
        y, x = np.where(masks == 0)
        mask = None
        mask_idx = 0
        possible_locations = [loc for loc in  zip(x, y)]

    max_tries = 50
    tries = 0
    while not location_found:
        if probe_touching:
            y, x, mask, mask_val, mask_idx = get_idxs(masks)
            possible_locations = [loc for loc in  zip(x, y)]

        min_dist = 20
        border_dist = 20
        width = masks.shape[0]

        loc = possible_locations[np.random.choice(len(possible_locations))]
        overlap = check_overlap(loc, border_dist, min_dist, masks)
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

def construct_tdw_trial(tdw_dataset, tdw_root, scene_idx, probe_touching=False):
    image, segment_map, file_name = tdw_dataset.__getitem__(scene_idx)

    # Pick an object to probe
    probe_location, bounding_box, mask_idx, mask_val = get_probe_location(
        segment_map, probe_touching
    )
    url = file_name.split(tdw_root)[1:]
    trial_data = {"image_url": url,
                  "scene_idx": int(scene_idx),
                  "probe_touching": probe_touching,
                  "probe_location": probe_location,
                  "gt_bounding_box": bounding_box,
                  "mask_idx": int(mask_idx),
                  "mask_val": int(mask_val)}

    return trial_data

def construct_gestalt_trial(root_dir, scene_name, texture, obj_split, scene_idx, probe_touching=False):
    scene_dir = os.path.join(root_dir, scene_name)

    frame_found = False
    while not frame_found:
        frame_idx = np.random.choice(range(1, 64))
        mask_path = os.path.join(scene_dir, "masks", f"Image{frame_idx:04d}.png")
        masks = np.array(Image.open(mask_path).convert("L"))
        mask_vals = np.unique(masks)
        if  len(mask_vals) > 1:
            frame_found = True

    config_file = os.path.join(scene_dir, "scene_config.pkl")
    with open(config_file, "rb") as f:
        config_data = pickle.load(f)


    probe_location, bounding_box, mask_idx, mask_val = get_probe_location(masks, probe_touching)
    obj_shape_data = config_data["objects"][f"h1_{mask_idx}"]["shape_params"]
    obj_scaling_data = config_data["objects"][f"h1_{mask_idx}"]["scaling_params"]
    obj_type_data = config_data["objects"][f"h1_{mask_idx}"]["shape_type"]
    obj_rotation_data = config_data["objects"][f"h1_{mask_idx}"]["rotation_quaternion"][frame_idx]
    obj_location_data = config_data["objects"][f"h1_{mask_idx}"]["location"][frame_idx]
    obj_texture_data = config_data["objects"][f"h1_{mask_idx}"]["texture"]
    background_texture_data = config_data["background"]["texture"]

    trial_data = {"image_url": scene_name, "frame_idx": int(frame_idx),
                  "probe_touching": probe_touching,
                  "probe_location": [int(x) for x in probe_location],
                  "gt_bounding_box": bounding_box, # [int(x) for x in bounding_box],
                  "mask_idx": int(mask_idx),
                  "mask_val": int(mask_val),
                  "obj_shape_data": [float(x) for x in obj_shape_data],
                  "obj_scaling_data": [float(x) for x in obj_scaling_data],
                  "obj_shape_type": str(obj_type_data),
                  "obj_location_data": [float(x) for x in obj_location_data],
                  "obj_rotation_data": [float(x) for x in obj_rotation_data],
                  "obj_texture_data": obj_texture_data,
                  "background_texture": background_texture_data}

    return trial_data


def tdw_main():
    # Generate single batch of 120 images evenly balanced by:
    # 5 on-target scenes + 5 off-target scenes for splits of texture, number_objects
    root_dir = "/om2/user/yyf/tdw_playroom_small"
    dataset = tdw_dataset.TDWDataset(root_dir, training=False)
    ignore_dir = "/om2/user/yyf"
    batch_data = []
    for i in tqdm(range(125)):

        probe_touching = i % 2 == 0
        trial_data = construct_tdw_trial(dataset, ignore_dir,
                                         scene_idx=i,
                                         probe_touching=probe_touching)
        batch_data.append(trial_data)

    df = pd.DataFrame(batch_data)
    print(df["probe_touching"].mean())

    with open("/home/yyf/mlve/experiments/stimuli/tdw_detection_pilot_batch_0.json", "w") as f:
        json.dump({"data": batch_data}, f)

def gestalt_main():
    root_dir = "/om/user/yyf/CommonFate/scenes"
    textures = ["test_wave", "test_voronoi", "test_noise"]
    obj_splits = [f"superquadric_{i}" for i in range(1, 5)]

    batches = [[] for i in range(10)]
    probe_touching = True
    for texture in textures:
        for obj_split in obj_splits:
            scene_dir = os.path.join(root_dir, texture, obj_split)
            scenes = glob(scene_dir + "/scale*")
            scenes.sort()
            for i, scene in tqdm(enumerate(scenes)):
                path_components = scene.split(root_dir)
                scene_name = path_components[1][1:]
                if i % 10 == 0:
                    probe_touching = not probe_touching

                trial_data = construct_gestalt_trial(root_dir, scene_name, texture, obj_split, i, probe_touching)
                batch_idx = int(scene_name[-1])
                batches[batch_idx].append(trial_data)
    """
    for i in range(5):
        if i > 2:
            probe_touching = False
        else:
            probe_touching = True
            scene_name = f"test_ground_truth/superquadric_1/scene_{i:03d}"
        trial_data = construct_gestalt_trial(root_dir, scene_name, "test_ground_truth", "superquadric_1", i, probe_touching)
        batch_data.append(trial_data)
    """
    df = pd.DataFrame(batches[0])
    print(df["probe_touching"].mean())

    for i, batch in enumerate(batches):
        root_dir = "/home/yyf/mlve/experiments/stimuli/"
        experiment_name = f"gestalt_static_localization_batch_{i}.json"
        print("Writing data to " + root_dir + experiment_name)
        with open(os.path.join(root_dir, experiment_name), "w") as f:
            json.dump({"data": batch}, f)

if __name__ == "__main__":
    gestalt_main()
