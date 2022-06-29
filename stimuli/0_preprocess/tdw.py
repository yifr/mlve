import os
import sys
import h5py
import json
import pickle
import numpy as np
from PIL import Image
from glob import glob
from tqdm import tqdm
from io import BytesIO

def depth_uint8_to_float32(depthmap, normalization=100.1, channels_last=True):
    assert depthmap.dtype == np.uint8, depthmap.dtype
    shape = depthmap.shape
    if channels_last:
        H,W,C = shape[-3:]
    else:
        C,H,W = shape[-3:]

    assert (C == 3), "Depthmap must have 3 channels but has %d" % C
    channel_weights = np.array([256.0*256.0, 256.0, 1.0], dtype=np.float32)

    channel_weights = np.reshape(
        channel_weights,
        ([1] * (len(shape)-3)) + ([1,1,C] if channels_last else [C,1,1]))

    out = np.sum(depthmap * channel_weights,
                    axis=(-1 if channels_last else -3),
                    keepdims=True)
    out *= np.array(normalization / (256.0**3)).astype(np.float32)
    return out

def format_tdw():
    tdw_path = "/om/user/yyf/playroom_large_v3"
    mlve_path = "/om/user/yyf/mlve/stimuli/tdw"
    model_splits = glob(tdw_path + "/*")
    model_splits.sort()
    os.makedirs(mlve_path, exist_ok=True)
    os.makedirs(mlve_path + "/train", exist_ok=True)

    available_model_splits = [ms for ms in model_splits if len(os.listdir(ms)) > 0]
    print(available_model_splits, len(available_model_splits))

    n_images = 100
    images_per_split = 10
    idx = 0
    pbar = tqdm(total=100)
    for i, ms in enumerate(available_model_splits[:10]):
        if i > 9:
            continue

        model_split = ms.split("/")[-1]
        model_names = json.load(open(os.path.join(ms, "model_names.json"), "r"))

        files = glob(ms + "/*")
        files.sort()
        for fname in files:
            if fname.endswith(".hdf5"):
                f = h5py.File(fname, "r")
                render_passes = f["frames"]["0000"]["images"]

                ###################
                # Format images
                ##################
                img = Image.open(BytesIO(render_passes["_img"][:]))
                os.makedirs(os.path.join(mlve_path, "images"), exist_ok=True)
                save_path = os.path.join(mlve_path, "images", f"image_{idx:03d}.png")
                img.save(save_path)

                ###################
                # Format masks
                ##################
                img = Image.open(BytesIO(render_passes["_id"][:]))
                os.makedirs(os.path.join(mlve_path, "masks"), exist_ok=True)
                save_path = os.path.join(mlve_path, "masks", f"mask_{idx:03d}.png")
                img.save(save_path)

                ###################
                # Format depths
                ##################
                depth_raw = render_passes["_depth"][:]
                depth_continuous = depth_uint8_to_float32(depth_raw).squeeze(2)
                depth_norm = (depth_continuous - depth_continuous.min()) / \
                                (depth_continuous.max() - depth_continuous.min())
                os.makedirs(os.path.join(mlve_path, "depths"), exist_ok=True)
                save_path = os.path.join(mlve_path, "depths", f"depth_{idx:03d}")
                with h5py.File(save_path + ".hdf5", "w") as f:
                    f.create_dataset("dataset", data=depth_norm, dtype=np.float32)

                depth_image = Image.fromarray((depth_norm * 255).astype(np.uint8))
                depth_image.save(save_path + ".png")

                ###################
                # Format normals
                ##################
                img = Image.open(BytesIO(render_passes["_normals"][:]))
                os.makedirs(os.path.join(mlve_path, "normals"), exist_ok=True)
                save_path = os.path.join(mlve_path, "normals", f"normal_{idx:03d}")
                normal_data = np.array(img)
                normal_cam = ((normal_data / 255) - 0.5) * 2
                with h5py.File(save_path + ".hdf5", "w") as f:
                    f.create_dataset("dataset", data=normal_cam, dtype=np.float32)

                img.save(save_path + ".png")

                ###################
                # Format meta
                ##################
                metadata = {}
                metadata["model_split"] = model_split
                metadata["trial_num"] = fname.split("/")[-1].split(".")[0]
                m_names = model_names[int(metadata["trial_num"])]
                metadata.update(m_names)
                os.makedirs(os.path.join(mlve_path, "meta"), exist_ok=True)
                save_path = os.path.join(mlve_path, "meta", f"meta_{idx:03d}.pkl")
                with open(save_path, "wb") as f:
                    pickle.dump(metadata, f)

                idx += 1
                pbar.update(1)
                if idx % 10 == 0:
                    break
                if idx == 100:
                    return


def format_train_tdw():
    tdw_path = "/om/user/yyf/playroom_large_v3"
    mlve_path = "/om/user/yyf/mlve/stimuli/tdw/train"
    model_splits = glob(tdw_path + "/*")
    model_splits.sort()
    os.makedirs(mlve_path, exist_ok=True)

    available_model_splits = [ms for ms in model_splits if len(os.listdir(ms)) > 0]
    print(available_model_splits, len(available_model_splits))

    n_images = 5
    idx = 0
    pbar = tqdm(total=5)
    for i, ms in enumerate(available_model_splits):

        model_split = ms.split("/")[-1]
        model_names = json.load(open(os.path.join(ms, "model_names.json"), "r"))

        files = glob(ms + "/*")
        files.sort()
        files.reverse()
        for fname in files:
            if fname.endswith(".hdf5"):
                f = h5py.File(fname, "r")
                render_passes = f["frames"]["0000"]["images"]

                ###################
                # Format images
                ##################
                img = Image.open(BytesIO(render_passes["_img"][:]))
                os.makedirs(os.path.join(mlve_path, "images"), exist_ok=True)
                save_path = os.path.join(mlve_path, "images", f"image_{idx:03d}.png")
                img.save(save_path)

                ###################
                # Format masks
                ##################
                img = Image.open(BytesIO(render_passes["_id"][:]))
                os.makedirs(os.path.join(mlve_path, "masks"), exist_ok=True)
                save_path = os.path.join(mlve_path, "masks", f"mask_{idx:03d}.png")
                img.save(save_path)

                ###################
                # Format depths
                ##################
                depth_raw = render_passes["_depth"][:]
                depth_continuous = depth_uint8_to_float32(depth_raw).squeeze(2)
                depth_norm = (depth_continuous - depth_continuous.min()) / \
                                (depth_continuous.max() - depth_continuous.min())
                os.makedirs(os.path.join(mlve_path, "depths"), exist_ok=True)
                save_path = os.path.join(mlve_path, "depths", f"depth_{idx:03d}")
                with h5py.File(save_path + ".hdf5", "w") as f:
                    f.create_dataset("dataset", data=depth_norm, dtype=np.float32)

                depth_image = Image.fromarray((depth_norm * 255).astype(np.uint8))
                depth_image.save(save_path + ".png")

                ###################
                # Format normals
                ##################
                img = Image.open(BytesIO(render_passes["_normals"][:]))
                os.makedirs(os.path.join(mlve_path, "normals"), exist_ok=True)
                save_path = os.path.join(mlve_path, "normals", f"normal_{idx:03d}")
                normal_data = np.array(img)
                normal_cam = ((normal_data / 255) - 0.5) * 2
                with h5py.File(save_path + ".hdf5", "w") as f:
                    f.create_dataset("dataset", data=normal_cam, dtype=np.float32)

                img.save(save_path + ".png")

                ###################
                # Format meta
                ##################
                metadata = {}
                metadata["model_split"] = model_split
                metadata["trial_num"] = fname.split("/")[-1].split(".")[0]
                m_names = model_names[int(metadata["trial_num"])]
                metadata.update(m_names)
                os.makedirs(os.path.join(mlve_path, "meta"), exist_ok=True)
                save_path = os.path.join(mlve_path, "meta", f"meta_{idx:03d}.pkl")
                with open(save_path, "wb") as f:
                    pickle.dump(metadata, f)

                idx += 1
                pbar.update(1)

                if idx > 5:
                    return
                break

format_tdw()
format_train_tdw()
