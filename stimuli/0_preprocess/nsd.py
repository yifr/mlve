import os
import pickle
import shutil
from glob import glob

def process_nsd():
    root_path = "/mindhive/nklab3/users/tom/datasets/nsd/stimuli/nsd/special100"
    images = glob(root_path + "/*")

    mlve_path = "/om/user/yyf/mlve/stimuli/nsd"
    if not os.path.exists(mlve_path):
        os.makedirs(mlve_path)

    if not os.path.exists(os.path.join(mlve_path, "images")):
        os.makedirs(os.path.join(mlve_path, "images"))

    if not os.path.exists(os.path.join(mlve_path, "meta")):
        os.makedirs(os.path.join(mlve_path, "meta"))

    images.sort()
    for i, image_path in enumerate(images):
        save_path = os.path.join(mlve_path, "images", f"image_{i:03d}.png")
        print(image_path, "\n", save_path)
        shutil.copy(image_path, save_path)
        meta_data = image_path[:-4].split("/")[-1].split("_")
        meta_data = {"shared_idx": meta_data[0], "nsd_idx": meta_data[1]}
        with open(os.path.join(mlve_path, "meta", f"meta_{i:03d}.pkl"), "wb") as f:
            pickle.dump(meta_data, f)
        print(meta_data)

if __name__=="__main__":
    process_nsd()
