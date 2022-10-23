import os
import sys
import h5py
import shutil
import pickle
import numpy as np
from PIL import Image
from glob import glob
from tqdm import tqdm


def center_crop(data, width=512, height=512):
    print(data.shape)
    y, x = data.shape[:2]
    startx = x // 2 - width // 2
    starty = y // 2 - height // 2
    cropped = data[starty:starty + height, startx:startx + width]
    return cropped

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
    dataset_name = sys.argv[1]
    mask_type = sys.argv[2]
    print(dataset_name, mask_type)
    hypersim_path = "/om/user/yyf/hypersim"
    mlve_path = "/om/user/yyf/mlve/stimuli/" + dataset_name
    print("Writing data to: " + mlve_path)
    volumes = glob(hypersim_path + "/*")
    # volumes.sort()
    os.makedirs(mlve_path, exist_ok=True)
    os.makedirs(mlve_path + "/train/", exist_ok=True)
    i = 0
    volume_idx = 0
    while True:
        volume = volumes[volume_idx]
        volume_idx += 1
        if i > 104:
            break
        path = os.path.join(hypersim_path, volume)
        meta_path = path + "/_detail/"
        data_path = path + "/images/"

        cam_data = glob(os.path.join(data_path, "scene_cam_0*_final_preview"))
        geom_data = glob(os.path.join(data_path, "scene_cam_0*_geometry_hdf5"))
        geom_preview = glob(os.path.join(data_path, "scene_cam_0*_geometry_preview"))
        geom_preview.sort()
        geom_data.sort()
        cam_data.sort()

        ###############################
        # copy semantic instance masks
        ###############################
        panoptic_masks = "render_entity_id"
        semantic_masks = "semantic_instance"
        if mask_type == "panoptic":
            mask_type = panoptic_masks
        else:
            mask_type = semantic_masks
        masks = glob(os.path.join(geom_data[0], f"frame.*.{mask_type}.hdf5"))
        masks.sort()
        mask_path = masks[-1]
        mask_data = h5py.File(mask_path, "r")["dataset"][:]
        mask_data += 1
        mask_data = center_crop(mask_data)

        if len(np.unique(mask_data)) < 4:
            volume_idx += 1
            print("NOT ENOUGH MASK IDs PRESENT")
            continue

        mask_images = glob(os.path.join(geom_preview[0], f"frame.*.{mask_type}.png"))
        mask_images.sort()
        mask_image_path = mask_images[-1]
        mask_image = Image.open(mask_image_path)

        width, height = mask_image.size   # Get dimensions
        left = (width - 512)/2
        top = (height - 512)/2
        right = (width + 512)/2
        bottom = (height + 512)/2

        mask_image = mask_image.crop((left, top, right, bottom))

        if i > 99:
            idx = i % 100
            os.makedirs(os.path.join(mlve_path, "train", "masks"), exist_ok=True)
            save_path = os.path.join(mlve_path, "train", "masks", f"mask_{idx:03d}")
        else:
            os.makedirs(os.path.join(mlve_path, "masks"), exist_ok=True)
            save_path = os.path.join(mlve_path, "masks", f"mask_{i:03d}")

        with h5py.File(save_path + ".hdf5", "w") as f:
            f.create_dataset("dataset", data=mask_data, dtype=np.uint8)

        mask_image.save(save_path + ".png")

        ###############################
        # copy images
        ###############################
        images = os.path.join(cam_data[0], "frame.*.tonemap.jpg")
        images = glob(images)
        images.sort()
        image_path = images[-1]
        image = Image.open(image_path)

        width, height = image.size   # Get dimensions

        left = (width - 512) / 2
        top = (height - 512) / 2
        right = (width + 512) / 2
        bottom = (height + 512) / 2

        image = image.crop((left, top, right, bottom))
        image_name = f"image_{i:03d}.png"

        if i > 99:
            idx = i % 100
            image_name = f"image_{idx:03d}.png"
            os.makedirs(os.path.join(mlve_path, "train", "images"), exist_ok=True)
            save_path = os.path.join(mlve_path, "train", "images", image_name)
        else:
            os.makedirs(os.path.join(mlve_path, "images"), exist_ok=True)
            save_path = os.path.join(mlve_path, "images", image_name)

        image.save(save_path)


        ###############################
        # copy depth
        ###############################
        depths = glob(os.path.join(geom_data[0], "frame.*.depth_meters.hdf5"))
        depths.sort()
        depth_path = depths[-1]
        distance = h5py.File(depth_path, "r")["dataset"][:]
        depth = hypersim_distance_to_depth(distance)
        depth = (depth - np.nanmin(depth)) / (np.nanmax(depth) - np.nanmin(depth))  # normalize to [0, 1]
        depth = center_crop(depth)
        depth_image = Image.fromarray(np.uint8(depth * 255))

        if i > 99:
            idx = i % 100
            os.makedirs(os.path.join(mlve_path, "train", "depths"), exist_ok=True)
            save_path = os.path.join(mlve_path, "train", "depths", f"depth_{idx:03d}")
        else:
            os.makedirs(os.path.join(mlve_path, "depths"), exist_ok=True)
            save_path = os.path.join(mlve_path, "depths", f"depth_{i:03d}")

        with h5py.File(save_path + ".hdf5", "w") as f:
            f.create_dataset("dataset", data=depth, dtype=np.float32)

        depth_image.save(save_path + ".png")

        ###############################
        # copy normals
        ###############################
        normals = glob(os.path.join(geom_data[0], "frame.*.normal_cam.hdf5"))
        normals.sort()
        normal_path = normals[-1]
        f = h5py.File(normal_path, "r")
        normal = f["dataset"][:]
        normal = center_crop(normal)
        print(normal.shape)
        coloring = (normal * 0.5 + 0.5) * 255
        rgba = np.concatenate((coloring, np.ones_like(coloring[:, :, :1]) * 255), axis=-1)
        rgba[np.logical_and(rgba[:, :, 0] == 127.5, \
                            rgba[:, :, 1] == 127.5, \
                            rgba[:, :, 2] == 127.5), :] = 0.
        img = Image.fromarray(np.uint8(rgba))
        if i >= 100:
            idx = i % 100
            os.makedirs(os.path.join(mlve_path, "train", "normals"), exist_ok=True)
            save_path = os.path.join(mlve_path, "train", "normals", f"normal_{idx:03d}")
        else:
            os.makedirs(os.path.join(mlve_path, "normals"), exist_ok=True)
            save_path = os.path.join(mlve_path, "normals", f"normal_{i:03d}")

        img.save(save_path + ".png")
        with h5py.File(save_path + ".hdf5", "w") as f:
            f.create_dataset("dataset", data=normal)

        # shutil.copyfile(normal_path, save_path + ".hdf5")

        ###############################
        # format metadata
        ###############################
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
        if i > 99:
            idx = i % 100
            os.makedirs(os.path.join(mlve_path, "train", "meta"), exist_ok=True)
            save_path = os.path.join(mlve_path, "train", "meta", f"meta_{idx:03d}.pkl")
        else:
            os.makedirs(os.path.join(mlve_path, "meta"), exist_ok=True)
            save_path = os.path.join(mlve_path, "meta", f"meta_{i:03d}.pkl")
        with open(save_path, "wb") as f:
            pickle.dump(meta, f)


        i += 1

if __name__=="__main__":
    format_hypersim()
