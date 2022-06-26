import os
import cv2
import h5py
import shutil
import pickle
import numpy as np
from glob import glob
from tqdm import tqdm
from PIL import Image

def load_pose(filename):
    lines = open(filename).read().splitlines()
    if len(lines) == 1:
        pose = np.zeros((4, 4), dtype=np.float32)
        for i in range(16):
            pose[i // 4, i % 4] = lines[0].split(" ")[i]
        return pose.squeeze()
    else:
        lines = [[x[0], x[1], x[2], x[3]] for x in (x.split(" ") for x in lines[:4])]
        return np.asarray(lines).astype(np.float32).squeeze()

def world2cam_normals(np_array):
    extrinsics_fname =  str("/home/yyf/CommonFate") + "/camera_extrinsics.txt"
    extrinsics = load_pose(extrinsics_fname)

    rotation = np.linalg.inv(extrinsics[:3, :3])
    rotated = np.einsum('ij,abj->abi', rotation, np_array)
    return rotated

def exr2numpy(exr, maxvalue=15., normalize=True):
    """ converts 1-channel exr-data to 2D numpy arrays
        Params:
            exr: exr file path
            maxvalue: max clipping value
            RGB: whether to return images in RGB mode (default is BGR)
            normalize: whehter or not to normalize images
    """
    # normalize
    data = cv2.imread(exr, cv2.IMREAD_ANYCOLOR | cv2.IMREAD_ANYDEPTH)
    # data = cv2.cvtColor(data, cv2.COLOR_BGR2RGB)
    data = np.array(data)
    data[data > maxvalue] = maxvalue
    data[data == maxvalue] = 0.

    if normalize:
        data /= np.max(data)
    return data

def format_gestalt():
    gestalt_dir = "/om/user/yyf/CommonFate/scenes/"
    mlve_dir = "/om/user/yyf/mlve/stimuli/gestalt"

    texture_dirs = "test_*"
    object_dirs = "superquadric_*"

    scene_dirs = glob(os.path.join(gestalt_dir, texture_dirs, object_dirs, '*scene=0'))
    np.random.shuffle(scene_dirs)
    noise = 0
    dot = 0
    wave = 0
    for scene_idx in tqdm(range(100)):
        scene_dir = scene_dirs[scene_idx]
        if "wave" in scene_dir:
            wave += 1
        elif "noise" in scene_dir:
            noise += 1
        else:
            dot += 1

        n_frames = 64
        frame_idx = np.random.randint(1, 65)

        #######################
        # copy images
        #######################
        image_path = os.path.join(scene_dir, "images", f"Image{frame_idx:04d}.png")
        save_path = os.path.join(mlve_dir, "images", f"image_{scene_idx:03d}.png")
        shutil.copy(image_path, save_path)

        #######################
        # copy masks
        #######################
        mask_path = os.path.join(scene_dir, "masks", f"Image{frame_idx:04d}.png")
        save_path = os.path.join(mlve_dir, "masks", f"mask_{scene_idx:03d}.png")
        shutil.copy(mask_path, save_path)

        #######################
        # copy depths
        #######################
        depth_path = os.path.join(scene_dir, "depths", f"Image{frame_idx:04d}.png")
        depth_data = np.array(Image.open(depth_path))
        depth_data = 1 - depth_data # reverse depths

        save_path = os.path.join(mlve_dir, "depths", f"depth_{scene_idx:03d}")
        with h5py.File(save_path + ".hdf5", "w") as f:
            f.create_dataset("dataset", data=depth_data)

        depth_snapshot = Image.fromarray(depth_data.astype(np.uint8))
        depth_snapshot.save(save_path  + ".png")

        #######################
        # copy surface normals
        #######################
        exr_path = os.path.join(scene_dir, "normals", f"Image{frame_idx:04d}.exr")
        normal_data = exr2numpy(exr_path)
        cam_normals = world2cam_normals(normal_data)
        coloring = ((cam_normals * 0.5 + 0.5) * 255)
        rgba = np.concatenate((coloring, np.ones_like(coloring[:, :, :1]) * 255), axis=-1)
        rgba[np.logical_and(rgba[:, :, 0] == 127.5, rgba[:, :, 1] == 127.5, rgba[:, :, 2] == 127.5), :] = 0.

        normals = Image.fromarray(np.uint8(rgba))
        save_path = os.path.join(mlve_dir, "normals", f"normal_{scene_idx:03d}")
        with h5py.File(save_path + ".hdf5", "w") as f:
            f.create_dataset("dataset", data=cam_normals)

        normals.save(save_path + ".png")

        #######################
        #  Write out metadata
        #######################
        scene_config = pickle.load(open(os.path.join(scene_dir, "scene_config.pkl"), "rb"))
        objects = scene_config["objects"]
        del objects["h1"]
        for obj in objects:
            objects[obj]["location"] = objects[obj]["location"][frame_idx - 1]
            objects[obj]["rotation_quaternion"] = objects[obj]["rotation_quaternion"][frame_idx - 1]
            del objects[obj]["axis"]
            del objects[obj]["angle"]
            del objects[obj]["rotation_matrix"]

        save_path = os.path.join(mlve_dir, "meta", f"meta_{scene_idx:03d}.pkl")
        with open(save_path, "wb") as f:
            pickle.dump(scene_config, f)

    print(dot, wave, noise)

if __name__=="__main__":
    format_gestalt()
