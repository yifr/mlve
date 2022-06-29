import os
import h5py
import numpy as np
from glob import glob
from tqdm import tqdm
import sys

sys.path.append("../")
from utils import probes
sys.path.append("../../")
import cabutils

def map_range(X, A, B, C, D):
    return (X - A) / (B - A) * (D - C) + C

def main(dataset):
    conn = cabutils.get_db_connection()
    proj_name = "mlve"
    exp_name = "hypersim_surface-normals"
    iter_name = "v2"

    db = conn["mlve_inputs"]
    col = db[exp_name]
    col.drop()

    n_batches = 20
    root_path = "/om/user/yyf/mlve/stimuli/" + dataset
    s3_root = "https://mlve-v1.s3.us-east-2.amazonaws.com/" + dataset
    scenes = glob(root_path + "*")
    scenes.sort()

    batches = [[] for i in range(n_batches)]
    print("Generating experiment trials...")
    for scene_idx, scene in enumerate(tqdm(scenes)):
        if scene_idx == 100:
            break

        image_dir = os.path.join(scene, "images", "scene_cam_00_final_preview")
        image_files = glob(image_dir + "/*tonemap.jpg")
        if len(image_files) < 1:
            print("Scene has no files: ", image_dir)
            continue

        normal_img_dir = os.path.join(scene, "images", "scene_cam_00_geometry_preview")
        normal_img_files = glob(normal_img_dir + "/*normal_cam.png")

        geometry_dir = os.path.join(scene, "images", "scene_cam_00_geometry_hdf5")
        hdf5_files = glob(geometry_dir + "/*normal_cam.hdf5")

        image_files.sort()
        normal_img_files.sort()
        hdf5_files.sort()

        normal_file = hdf5_files[-1]
        img_file = image_files[-1]
        normal_img_file = normal_img_files[-1]

        # Image URL
        img_path = img_file.split(root_path)[1]
        img_url = os.path.join(s3_root, img_path)

        normal_img_path = normal_img_file.split(root_path)[1]
        normal_img_url = os.path.join(s3_root, normal_img_path)

        # Sample points
        normal_data = h5py.File(normal_file, "r")["dataset"][:]
        img_shape = normal_data.shape
        xs = np.arange(0, img_shape[1], 1)
        ys = np.arange(0, img_shape[0], 1)

        # Sample a different point in the image for each batch
        points_sampled = set()
        for batch_idx in range(n_batches):
            batch = batches[batch_idx]

            trial_data = {}

            # Reject points that were sampled for other batches, or contain NaNs
            point = None
            for _ in range(50):
                col_sample = np.random.choice(xs)
                row_sample = np.random.choice(ys)
                point = (row_sample, col_sample)
                if sum(normal_data[point]) == float("nan"):
                    points_sampled.add(point)
                    point = None
                    continue

                if point not in points_sampled:
                    break

            if point == None:
                print("No valid point found. Exiting")
                sys.exit()

            points_sampled.add(point)
            normal_vec = normal_data[point[0], point[1]]
            trial_data["imageURL"] = img_url
            trial_data["normalImageURL"] = normal_img_url
            trial_data["trueArrowDirection"] = [float(x) for x in normal_vec]
            trial_data["randomizeArrowInitialDirection"] = True
            trial_data["arrowPixelPosition"] = [int(x) for x in point]
            img_width = img_shape[1]
            img_height = img_shape[0]
            arrow_NDC = [map_range(point[0], 0, img_height, -1, 1),
                         map_range(point[1], 0, img_width, -1, 1)]

            arrow_NDC.append(0)
            trial_data["arrowPosition"] = arrow_NDC
            trial_data["trialType"] = "unsupervised"
            trial_data["batch_idx"] = batch_idx

            batch.append(trial_data)

    print("Example Batch: ", batches[0])

    # Generate familiarization trials
    print("Generating familiarization trials...")
    familiarization_trials = []
    for si in range(scene_idx, scene_idx + 6):
        scene = scenes[si]
        image_dir = os.path.join(scene, "images", "scene_cam_00_final_preview")
        image_files = glob(image_dir + "/*tonemap.jpg")
        if len(image_files) < 1:
            print("Scene has no files: ", image_dir)
            continue

        geometry_dir = os.path.join(scene, "images", "scene_cam_00_geometry_hdf5")
        hdf5_files = glob(geometry_dir + "/*normal_cam.hdf5")

        normal_img_dir = os.path.join(scene, "images", "scene_cam_00_geometry_preview")
        normal_img_files = glob(normal_img_dir + "/*normal_cam.png")

        image_files.sort()
        hdf5_files.sort()
        normal_img_files.sort()

        normal_file = hdf5_files[-1]
        img_file = image_files[-1]
        normal_img_file = normal_img_files[-1]

        # Image URL
        img_path = img_file.split(root_path)[1]
        img_url = os.path.join(s3_root, img_path)

        normal_img_path = normal_img_file.split(root_path)[1]
        normal_img_url = os.path.join(s3_root, normal_img_path)

        # Sample points
        normal_data = h5py.File(normal_file, "r")["dataset"][:]
        img_shape = normal_data.shape

        ys = np.arange(0, img_shape[0], 1)
        xs = np.arange(0, img_shape[1], 1)

        point = None
        for i in range(10):
            x_sample = np.random.choice(xs)
            y_sample = np.random.choice(ys)
            point = (y_sample, x_sample)
            if sum(normal_data[point]) == float("nan"):
                point = None
                continue
            else:
                break

        normal_vec = normal_data[y_sample, x_sample]

        trial_type = "supervised" if si < (scene_idx + 3) else "reinforcement"

        trial_data = {}
        trial_data["imageURL"] = img_url
        trial_data["normalImageURL"] = normal_img_url
        trial_data["trueArrowDirection"] = [float(x) for x in normal_vec]
        trial_data["randomizeArrowInitialDirection"] = True
        trial_data["arrowPixelPosition"] = [int(x) for x in point]
        arrow_NDC = [map_range(point[0], 0, img_height, -1, 1),
                     map_range(point[1], 0, img_width, -1, 1)]
        arrow_NDC.append(0)
        trial_data["arrowPosition"] = arrow_NDC
        trial_data["trialType"] = trial_type

        familiarization_trials.append(trial_data)

    metadata = {"proj_name": proj_name, "exp_name": exp_name, "iter_name": iter_name}
    for i, batch in enumerate(batches):
        metadata["batch_idx"] = i
        data = {"metadata": metadata,
                "trials": batch,
                "familiarization_trials": familiarization_trials}
        res = col.insert_one({"data": data})
        print("Sent data to MongoDB store: ", res)

if __name__=="__main__":
    main()
