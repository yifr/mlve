import os
import sys
import json
import pickle
import hashlib
import numpy as np
from PIL import Image
from glob import glob
from tqdm import tqdm

sys.path.append("../")
from utils import probes

def construct_gestalt_trial(root_dir, scene_name):
    scene_dir = os.path.join(root_dir, scene_name)

    config_file = os.path.join(scene_dir, "scene_config.pkl")
    with open(config_file, "rb") as f:
        config_data = pickle.load(f)

    frame_found = False
    while not frame_found:
        frame_idx = np.random.choice(range(1, 64))
        mask_path = os.path.join(scene_dir, "masks", f"Image{frame_idx:04d}.png")
        masks = np.array(Image.open(mask_path).convert("L"))
        mask_vals = np.unique(masks)
        if  len(mask_vals) > 1:
            frame_found = True

    probe_location, bounding_box, mask_idx, mask_val = probes.get_probe_location(masks, probe_touching=True)

    obj_shape_data = config_data["objects"][f"h1_{mask_idx}"]["shape_params"]
    obj_scaling_data = config_data["objects"][f"h1_{mask_idx}"]["scaling_params"]
    obj_type_data = config_data["objects"][f"h1_{mask_idx}"]["shape_type"]
    obj_rotation_data = config_data["objects"][f"h1_{mask_idx}"]["rotation_quaternion"][frame_idx]
    obj_location_data = config_data["objects"][f"h1_{mask_idx}"]["location"][frame_idx]
    obj_texture_data = config_data["objects"][f"h1_{mask_idx}"]["texture"]
    background_texture_data = config_data["background"]["texture"]

    object_key = f"{obj_type_data}_{obj_shape_data[0]:.03f}_{obj_shape_data[1]:.03f}"

    # TODO: Sample with graded difficulty
    alt_opts = glob("/om/user/yyf/CommonFate/media/2-afc/*")
    alt_key = np.random.choice(alt_opts)[:-4]

    trial_data = {"image_url": scene_name, "frame_idx": int(frame_idx),
                  "gt_shape_params": [float(x) for x in obj_shape_data],
                  "gt_shape_url": object_key,
                  "alt_shape_url": alt_key,
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


def create_batches(root_dir, scenes_per_bin):
    textures = ["voronoi", "wave", "noise"]
    batches = [[] for i in range(scenes_per_bin)]
    for texture in textures:
        for n_objs in range(1, 5):
            scene_dir = os.path.join(root_dir, "test_" + texture, "superquadric_" + str(n_objs))
            scenes = glob(scene_dir + "/scale*")
            scenes.sort()
            for scene in tqdm(scenes):
                path_components = scene.split(root_dir)
                scene_name = path_components[1][1:]
                trial_data = construct_gestalt_trial(root_dir, scene_name)
                batch_idx = int(scene_name[-1])
                batches[batch_idx].append(trial_data)

    for i, batch in enumerate(batches):
        root_dir = "/home/yyf/mlve/experiments/stimuli/"
        experiment_name = f"gestalt_static_2afc_batch_{i}.json"
        print("Writing data to " + root_dir + experiment_name)
        with open(os.path.join(root_dir, experiment_name), "w") as f:
            json.dump({"data": batch}, f)

create_batches("/om/user/yyf/CommonFate/scenes", 10)

