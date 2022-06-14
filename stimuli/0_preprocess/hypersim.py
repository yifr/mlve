import os
import h5py
import shutil
import pickle
import numpy as np
from PIL import Image
from glob import glob
from tqdm import tqdm


def hypersim_distance_to_depth(npyDistance):
    intWidth = 1024
    intHeight = 768
    fltFocal = 886.81
    npyImageplaneX = np.linspace((-0.5 * intWidth) + 0.5, (0.5 * intWidth) - 0.5, intWidth).reshape(1, intWidth).repeat(intHeight, 0).astype(np.float32)[:, :, None]
    npyImageplaneY = np.linspace((-0.5 * intHeight) + 0.5, (0.5 * intHeight) - 0.5, intHeight).reshape(intHeight, 1).repeat(intWidth, 1).astype(np.float32)[:, :, None]
    npyImageplaneZ = np.full([intHeight, intWidth, 1], fltFocal, np.float32)
    npyImageplane = np.concatenate([npyImageplaneX, npyImageplaneY, npyImageplaneZ], 2)

    npyDepth = npyDistance / np.linalg.norm(npyImageplane, 2, 2) * fltFocal
    return npyDepth

def format_hypersim():
    hypersim_path = "/om/user/yyf/hypersim"
    mlve_path = "/om/user/yyf/mlve/stimuli/hypersim"
    volumes = glob(hypersim_path + "/*")
    volumes.sort()
    for i, volume in tqdm(enumerate(volumes)):
        path = os.path.join(hypersim_path, volume)
        meta_path = path + "/_detail/"
        data_path = path + "/images/"

        cam_data = glob(os.path.join(data_path, "scene_cam_0*_final_preview"))
        geom_data = glob(os.path.join(data_path, "scene_cam_0*_geometry_hdf5"))
        geom_data.sort()
        cam_data.sort()

        # copy images
        images = os.path.join(cam_data[0], "frame.*.tonemap.jpg")
        images = glob(images)
        images.sort()
        image_path = images[-1]
        image = Image.open(image_path)
        image_name = f"image_{i:03d}.png"
        save_path = os.path.join(mlve_path, "images", image_name)
        image.save(save_path)

        # copy semantic instance masks
        masks = glob(os.path.join(geom_data[0], "frame.*.semantic_instance.hdf5"))
        masks.sort()
        mask_path = masks[-1]
        mask = h5py.File(mask_path, "r")
        data = mask["dataset"][:]
        data[data < 0] = 0
        mask_image = Image.fromarray(np.uint8(data))
        save_path = os.path.join(mlve_path, "masks", f"mask_{i:03d}.png")
        mask_image.save(save_path)

        # copy depth
        depths = glob(os.path.join(geom_data[0], "frame.*.depth_meters.hdf5"))
        depths.sort()
        depth_path = depths[-1]
        distance = h5py.File(depth_path, "r")["dataset"][:]
        depth = hypersim_distance_to_depth(distance)
        depth = (depth - np.nanmin(depth)) / (np.nanmax(depth) - np.nanmin(depth))
        depth_image = Image.fromarray(np.uint8(depth * 255))
        save_path = os.path.join(mlve_path, "depths", f"depth_{i:03d}.png")
        depth_image.save(save_path)

        # copy normals
        normals = glob(os.path.join(geom_data[0], "frame.*.normal_cam.hdf5"))
        normals.sort()
        normal_path = normals[-1]
        save_path = os.path.join(mlve_path, "normals", f"normal_{i:03d}.png")
        shutil.copyfile(normal_path, save_path)

        # format metadata
        meta = {}
        meta["volume"] = volume
        cam_data = glob(meta_path + "*")
        cam_data.sort()
        cam_dir = cam_data[0]
        # Camera orientation
        orientations = h5py.File(cam_dir + "/camera_keyframe_orientations.hdf5", "r")
        orientation = orientations["dataset"][:][-1]
        meta["cam_orientation"] = orientation
        # Camera position
        positions = h5py.File(cam_dir + "/camera_keyframe_positions.hdf5", "r")
        position = positions["dataset"][:][-1]
        meta["cam_position"] = position
        meta["cam_id"] = cam_dir.split("/")[-1]
        meta["frame_idx"] = int(normal_path.split("frame.")[1].split(".")[0])
        save_path = os.path.join(mlve_path, "meta", f"meta_{i:03d}.pkl")
        with open(save_path, "wb") as f:
            pickle.dump(meta, f)

        if i >= 100:
            break

if __name__=="__main__":
    format_hypersim()
