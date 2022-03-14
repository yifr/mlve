import os
import glob
import pickle
import tqdm
import pandas as pd
from PIL import Image
import numpy as np

def generate_probe_location(masks, probe_touching):
    if probe_touching:
        mask_vals = np.unique(masks)
        mask_val = np.random.choice(mask_vals[1:])
        mask_idx = list(mask_vals[1:]).index(mask_val)
        mask = masks == mask_val

        y, x = np.where(mask)
        possible_locations = [loc for loc in zip(x, y)]
        probe_idx = np.random.choice(range(len(possible_locations)))
        loc = possible_locations[probe_idx]

        return [int(l) for l in loc], mask, mask_idx
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
                    np.sqrt((loc[1] - y_b) ** 2) > 1
                    and np.sqrt((loc[0] - x_b) ** 2) > 1
                ):
                    return [int(l) for l in loc], None, 0


def get_probe_location(masks, probe_touching=True):

    probe_location, mask, mask_idx = generate_probe_location(masks, probe_touching)

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

    return probe_location, bounding_box, mask_idx

def main():
    # Generate single batch of 120 images evenly balanced by:
    # 5 on-target scenes + 5 off-target scenes for splits of texture, number_objects
    root_dir = "/om/user/yyf/CommonFate/scenes"
    textures = ["test_wave", "test_voronoi", "test_noise"]
    obj_splits = [f"superquadric_{i}" for i in range(1, 5)]
    scenes_per_group = 5
    batch_data = []
    for texture in textures:
        for obj_split in obj_splits:
            print(texture, obj_split)
            for i in range(scenes_per_group * 2):
                try:
                    scene_path = os.path.join(texture, obj_split, f"scene_{i:03d}")
                    print(scene_path)
                    scene_dir = os.path.join(root_dir, scene_path)
                    frame_idx = np.random.choice(range(1, 64))
                    config_file = os.path.join(scene_dir, "scene_config.pkl")
                    with open(config_file, "rb") as f:
                        config_data = pickle.load(f)

                    mask_path = os.path.join(scene_dir, "masks", f"Image{frame_idx:04d}.png")
                    masks = np.array(Image.open(mask_path).convert("L"))

                    if i >= 5:
                        probe_touching = True
                    else:
                        probe_touching = False

                    probe_location, bounding_box, mask_idx = get_probe_location(masks, probe_touching)
                    obj_shape_data = config_data["objects"][f"h1_{mask_idx}"]["shape_params"]
                    obj_rotation_data = config_data["objects"][f"h1_{mask_idx}"]["rotation_matrix"][frame_idx]
                    obj_location_data = config_data["objects"][f"h1_{mask_idx}"]["location"][frame_idx]
                    obj_texture_data = config_data["objects"][f"h1_{mask_idx}"]["texture"]
                    background_texture_data = config_data["background"]["texture"]

                    trial_data = {"image_url": scene_path, "frame_idx": frame_idx, "probe_touching": probe_touching,
                                  "probe_location": probe_location, "bounding_box": bounding_box, "mask_idx": mask_idx,
                                  "obj_shape_data": obj_shape_data, "obj_location_data": obj_location_data,
                                  "obj_texture_data": obj_texture_data, "background_texture": background_texture_data}

                    batch_data.append(trial_data)
                except Exception as e:
                    print(Exception)
                    return

    df = pd.DataFrame(batch_data)
    print(df.info())
    df.to_csv("detection_pilot_batch_0.csv")

if __name__=="__main__":
    main()