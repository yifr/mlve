import os
import sys
from glob import glob
import hashlib

sys.path.append("../")
from utils import probes

def construct_gestalt_trial(root_dir, scene_name):
    scene_dir = os.path.join(root_dir, scene_name)

    config_file = os.path.join(scene_dir, "scene_config.pkl")
    with open(config_file, "rb") as f:
        config_data = pickle.load(f)

    frame_found = False
    while not frame_found:
        try:
            frame_idx = np.random.choice(range(1, 64))
            mask_path = os.path.join(scene_dir, "masks", f"Image{frame_idx:04d}.png")
            masks = np.array(Image.open(mask_path).convert("L"))
            frame_found = True
        except:
            continue

    probe_location, bounding_box, mask_idx, mask_val = probes.get_probe_location(masks, probe_touching)
    print(mask_idx, mask_val)

    obj_shape_data = config_data["objects"][f"h1_{mask_idx}"]["shape_params"]
    obj_scaling_data = config_data["objects"][f"h1_{mask_idx}"]["scaling_params"]
    obj_type_data = config_data["objects"][f"h1_{mask_idx}"]["shape_type"]
    obj_rotation_data = config_data["objects"][f"h1_{mask_idx}"]["rotation_quaternion"][frame_idx]
    obj_location_data = config_data["objects"][f"h1_{mask_idx}"]["location"][frame_idx]
    obj_texture_data = config_data["objects"][f"h1_{mask_idx}"]["texture"]
    background_texture_data = config_data["background"]["texture"]

    object_key = f"{obj_type_data}_{obj_shape_data[0]}_{obj_shape_data[1]}".encode("utf-8")
    object_hash = hashlib.sha256(object_key)
    object_strhash = object_hash.hexdigest()

    # TODO: Sample with graded difficulty
    alt_params = np.random.uniform(0.1, 4., 2)
    alt_key = f"{obj_type_data}_{alt_params[0]}_{alt_params[1]}".encode("utf-8")
    alt_hash = hashlib.sha256(alt_key)
    alt_strhash = alt_hash.hexdigest()

    trial_data = {"image_url": scene_name, "frame_idx": int(frame_idx),
                  "gt_shape_url": object_strhash,
                  "alt_shape_url": alt_strhash,
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


def create_batches(root_dir, n_bins, scenes_per_bin):
    textures = ["voronoi", "wave", "noise"]
    batches = [[] for i in range(scenes_per_bin)]
    for texture in textures:
        for n_objs in range(1, 5):
            scene_dir = os.path.join(root_dir, "test_" + texture, "superquadric_" + str(n_objs))
            scenes = glob(scene_dir + "/scale*")
            print(len(scenes))

create_batches("/om/user/yyf/CommonFate/scenes", 9, 7)

