import os
import cv2
import h5py
import shutil
import pickle
import numpy as np
from glob import glob
from tqdm import tqdm
from PIL import Image
import matplotlib.pyplot as plt

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

def exr2numpy(exr, image_pass="depths"):
    """ converts 1-channel exr-data to 2D numpy arrays
        Params:
            exr: exr file path
            maxvalue: max clipping value
            normalize: whehter or not to normalize images
    """
    # normalize
    if image_pass == "depths":
        flag = cv2.IMREAD_ANYDEPTH
        data = cv2.imread(exr, flag)
        data = data / data.max()
        print(data.shape)
    else:
        data = cv2.imread(exr, cv2.IMREAD_ANYCOLOR | cv2.IMREAD_ANYDEPTH)
        # data = cv2.cvtColor(data, cv2.COLOR_BGR2RGB)
        data = np.array(data)

    return data

def format_gestalt():
    gestalt_dir = "/om/user/yyf/CommonFate/scenes/"
    mlve_dir = "/om/user/yyf/mlve/stimuli/gestalt_shapegen"
    os.makedirs(mlve_dir, exist_ok=True)

    train_dirs = "train_*"
    texture_dirs = "test_*"
    object_dirs = "shapegenerator_[1-3]"
    print(os.path.join(gestalt_dir, texture_dirs, object_dirs))
    scene_dirs = glob(os.path.join(gestalt_dir, texture_dirs, object_dirs, '*scene=0'))
    train_dirs = glob(os.path.join(gestalt_dir, train_dirs, object_dirs, "scene_10*"))
    np.random.shuffle(train_dirs)
    np.random.shuffle(scene_dirs)

    create_videos = False
    noise = 0
    dot = 0
    wave = 0
    os.makedirs(os.path.join(mlve_dir, "train"), exist_ok=True)
    n_scenes = 100
    n_familiarization = 5
    scene_idx = 0
    scene_list_idx = 0
    pbar = tqdm(total=105)
    idx = -1
    while scene_idx < (n_scenes + n_familiarization):
        if scene_idx >= n_scenes:
            scene_dir = train_dirs[idx]
            idx += 1
        else:
            scene_dir = scene_dirs[scene_list_idx]
        scene_list_idx += 1

        pbar.write(f"processing scene: {scene_dir}")
        if "wave" in scene_dir:
            if wave > 35:
                pbar.write("Too many wave scenes, skipping...")
                continue
            wave += 1
        elif "noise" in scene_dir:
            if noise > 35:
                pbar.write("Too many noise scenes, skipping...")
                continue
            noise += 1
        else:
            if dot > 35:
                pbar.write("Too many dot scenes, skipping..")
                continue
            dot += 1

        pbar.update(1)
        n_frames = 64
        frame_idx = 64


        #######################
        # copy images
        #######################
        if scene_idx >= n_scenes:
            if create_videos:
                os.makedirs(os.path.join(mlve_dir, "train", "videos"), exist_ok=True)
                save_path = os.path.join(mlve_dir, "train", "videos", f"video_{idx:03d}.mp4")
                image_dir = os.path.join(scene_dir, "images")
                os.system(
                    f"ffmpeg -y -framerate 16 -i {image_dir}/Image%04d.png -pix_fmt yuv420p -c:v libx264 {save_path}"
                )

            os.makedirs(os.path.join(mlve_dir, "train", "images"), exist_ok=True)
            save_path = os.path.join(mlve_dir, "train", "images", f"image_{idx:03d}.png")

        else:
            if create_videos:
                os.makedirs(os.path.join(mlve_dir, "videos"), exist_ok=True)
                save_path = os.path.join(mlve_dir, "videos", f"video_{scene_idx:03d}.mp4")
                image_dir = os.path.join(scene_dir, "images")
                os.system(
                    f"ffmpeg -y -framerate 16 -i {image_dir}/Image%04d.png -pix_fmt yuv420p -c:v libx264 {save_path}"
                )

            os.makedirs(os.path.join(mlve_dir, "images"), exist_ok=True)
            save_path = os.path.join(mlve_dir, "images", f"image_{scene_idx:03d}.png")

        image_path = os.path.join(scene_dir, "images", f"Image{frame_idx:04d}.png")
        shutil.copy(image_path, save_path)

        #######################
        # copy masks
        #######################
        mask_path = os.path.join(scene_dir, "masks", f"Image{frame_idx:04d}.png")
        masks = Image.open(mask_path).convert("L")

        if scene_idx >= n_scenes:
            os.makedirs(os.path.join(mlve_dir, "train", "masks"), exist_ok=True)
            idx = scene_idx % n_scenes
            save_path = os.path.join(mlve_dir, "train", "masks", f"mask_{idx:03d}.png")
        else:
            os.makedirs(os.path.join(mlve_dir, "masks"), exist_ok=True)
            save_path = os.path.join(mlve_dir, "masks", f"mask_{scene_idx:03d}.png")

        plt.imshow(masks)
        plt.axis("off")
        plt.tight_layout
        plt.imsave(save_path, masks)

        # shutil.copy(mask_path, save_path)

        #######################
        # copy depths
        #######################
        exr_path = os.path.join(scene_dir, "depth", f"Image{frame_idx:04d}.exr")
        if os.path.exists(exr_path):
            depth_data = exr2numpy(exr_path, image_pass="depths")
            print(depth_data.shape, " depth data shape")
        else:
            depth_path = os.path.join(scene_dir, "depths", f"Image{frame_idx:04d}.png")
            depth_data = np.array(Image.open(depth_path))
            # Change this if you re-render
            depth_data = 1 - depth_data # reverse depths

        if scene_idx >= n_scenes:
            os.makedirs(os.path.join(mlve_dir, "train", "depths"), exist_ok=True)
            idx = scene_idx % n_scenes
            save_path = os.path.join(mlve_dir, "train", "depths", f"depth_{idx:03d}")
        else:
            os.makedirs(os.path.join(mlve_dir, "depths"), exist_ok=True)
            save_path = os.path.join(mlve_dir, "depths", f"depth_{scene_idx:03d}")
        with h5py.File(save_path + ".hdf5", "w") as f:
            f.create_dataset("dataset", data=depth_data)

        depth_snapshot = Image.fromarray((depth_data * 255).astype(np.uint8))
        depth_snapshot.save(save_path  + ".png")

        #######################
        # copy surface normals
        #######################
        exr_path = os.path.join(scene_dir, "normals", f"Image{frame_idx:04d}.exr")
        normal_data = exr2numpy(exr_path, image_pass="normals")
        cam_normals = world2cam_normals(normal_data)
        coloring = ((cam_normals * 0.5 + 0.5) * 255)
        r, g, b = coloring[:, :, 0], coloring[:, :, 1], coloring[:, :, 2]
        coloring = np.dstack([g, r, b])
        print(coloring.shape)

        rgba = np.concatenate((coloring, np.ones_like(coloring[:, :, :1]) * 255), axis=-1)
        rgba[np.logical_and(rgba[:, :, 0] == 127.5, rgba[:, :, 1] == 127.5, rgba[:, :, 2] == 127.5), :] = 0.

        normals = Image.fromarray(np.uint8(rgba))
        if scene_idx >= n_scenes:
            os.makedirs(os.path.join(mlve_dir, "train", "normals"), exist_ok=True)
            idx = scene_idx % n_scenes
            save_path = os.path.join(mlve_dir, "train", "normals", f"normal_{idx:03d}")
        else:
            os.makedirs(os.path.join(mlve_dir, "normals"), exist_ok=True)
            save_path = os.path.join(mlve_dir, "normals", f"normal_{scene_idx:03d}")

        with h5py.File(save_path + ".hdf5", "w") as f:
            f.create_dataset("dataset", data=cam_normals)

        normals.save(save_path + ".png")

        #######################
        #  Write out metadata
        #######################
        config_path = os.path.join(scene_dir, "scene_config.pkl")
        if os.path.exists(config_path):
            scene_config = pickle.load(open(os.path.join(scene_dir, "scene_config.pkl"), "rb"))
            scene_config["meta"] = {"scene_dir": scene_dir}
            objects = scene_config["objects"]
            del objects["h1"]
            for obj in objects:
                objects[obj]["location"] = objects[obj]["location"][frame_idx - 1]
                objects[obj]["rotation_quaternion"] = objects[obj]["rotation_quaternion"][frame_idx - 1]
                del objects[obj]["axis"]
                del objects[obj]["angle"]
                del objects[obj]["rotation_matrix"]
        else:
            scene_config = {"meta": {"scene_dir": scene_dir}}

        if scene_idx >= n_scenes:
            os.makedirs(os.path.join(mlve_dir, "train", "meta"), exist_ok=True)
            save_path = os.path.join(mlve_dir, "train", "meta", f"meta_{idx:03d}.pkl")
        else:
            os.makedirs(os.path.join(mlve_dir, "meta"), exist_ok=True)
            save_path = os.path.join(mlve_dir, "meta", f"meta_{scene_idx:03d}.pkl")
        with open(save_path, "wb") as f:
            pickle.dump(scene_config, f)

        scene_idx += 1

    print(dot, wave, noise)

if __name__=="__main__":
    format_gestalt()
