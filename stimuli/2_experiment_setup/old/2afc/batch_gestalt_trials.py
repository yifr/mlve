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
sys.path.append("../../")
import cabutils

def construct_gestalt_trial(root_dir, scene_name, frame_idx=None):
    scene_dir = os.path.join(root_dir, scene_name)

    config_file = os.path.join(scene_dir, "scene_config.pkl")
    with open(config_file, "rb") as f:
        config_data = pickle.load(f)
        objects = [config_data["objects"][obj]["shape_params"][:2] for obj in config_data["objects"]]
        types = [config_data["objects"][obj]["shape_type"] for obj in config_data["objects"]]
        print([i for i in zip(objects, types)])

    if not frame_idx:
        frame_found = False
        while not frame_found:
            frame_idx = np.random.choice(range(1, 64))
            mask_path = os.path.join(scene_dir, "masks", f"Image{frame_idx:04d}.png")
            masks = np.array(Image.open(mask_path).resize((512, 512), resample=Image.NEAREST).convert("L"))
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
    print(object_key, mask_idx)
    # TODO: Sample with graded difficulty
    alt_root = "/om/user/yyf/CommonFate/media/2-afc/"
    if "ground_truth" in scene_name:
        if obj_type_data == "supertoroid":
            alt_root = alt_root + "superellipsoid"
        else:
            alt_root = alt_root + "supertoroid"

    alt_opts = glob(alt_root + "*")
    alt_img_path = np.random.choice(alt_opts)[:-4]
    alt_key = alt_img_path.split("/")[-1]

    s3_root = "https://gestalt-scenes.s3.us-east-2.amazonaws.com"
    gt_shape_url = os.path.join(s3_root, "media/2-afc", object_key + ".png")
    alt_shape_url = os.path.join(s3_root, "media/2-afc", alt_key + ".png")
    alt_shape_params = [float(x) for x  in alt_key.split("_")[1:]]
    image_url = os.path.join(s3_root, scene_name, "images", f"Image{frame_idx:04d}.png")
    trial_data = {"image_url": image_url,
                  "gt_shape_params": [float(x) for x in obj_shape_data],
                  "alt_shape_params": alt_shape_params,
                  "gt_shape_url": gt_shape_url,
                  "alt_shape_url": alt_shape_url,
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
    conn = cabutils.get_db_connection()
    proj_name = "mlve"
    exp_name = "gestalt_m2s"
    iter_name = "v1"

    db = conn["mlve_inputs"]
    col = db[exp_name]
    col.drop()

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
                trial_data["batch"] = batch_idx
                batches[batch_idx].append(trial_data)

    # Add attention checks
    for batch in batches:
        for i in range(10):
            probe_touching = i > 4
            scene_name = f"test_ground_truth/superquadric_1/scene_{i:03d}/"
            trial_data = construct_gestalt_trial(root_dir,  scene_name, frame_idx=0)
            trial_data["trial_type"] = "attention_check"
            batch.append(trial_data)

    # Add familiarization trials
    familiarization_trials = []
    for texture in ["train_noise", "train_voronoi", "train_wave"]:
        for i in range(2):
            num_objs = np.random.choice(range(1, 5))
            scene_name = os.path.join(texture, f"superquadric_{num_objs}", f"scene_{i:03d}")
            trial_data = construct_gestalt_trial(root_dir, scene_name)
            trial_data["trial_type"] = "practice"
            familiarization_trials.append(trial_data)

    metadata = {"proj_name": proj_name, "exp_name": exp_name, "iter_name": iter_name}

    for i, batch in enumerate(batches):
        root_dir = "/home/yyf/mlve/experiments/stimuli/"
        experiment_name = f"gestalt_static_2afc_batch_{i}.json"
        metadata["batch_idx"] = i
        data = {"metadata": metadata,
                "trials": batch,
                "familiarization_trials": familiarization_trials}
        res = col.insert_one({"data":data})
        print("Sent data to MongoDB store: ", res)
        print("Writing data to " + root_dir + "2afc" + "/" + experiment_name)
        os.makedirs(os.path.join(root_dir, "2afc"), exist_ok=True)
        """
        with open(os.path.join(root_dir, "2afc", experiment_name), "w") as f:
            json.dump(data, f)
        """
create_batches("/om/user/yyf/CommonFate/scenes", 10)

