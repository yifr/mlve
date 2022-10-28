import os
import pickle
import shutil
from PIL import Image
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
        meta_data = {"shared_idx": meta_data[0], "nsd_idx": int(meta_data[1][3:]) - 1}
        with open(os.path.join(mlve_path, "meta", f"meta_{i:03d}.pkl"), "wb") as f:
            pickle.dump(meta_data, f)
        print(meta_data)

    root_path = "/mindhive/nklab3/users/tom/datasets/nsd/stimuli/nsd/shared1000"
    images = glob(root_path + "/*")
    print(len(images))
    images.sort()
    os.makedirs(os.path.join(mlve_path, "train", "images"), exist_ok=True)
    os.makedirs(os.path.join(mlve_path, "train", "meta"), exist_ok=True)
    for i, image_path in enumerate(images[:5]):
        save_path = os.path.join(mlve_path, "train", "images", f"image_{i:03d}.png")
        print(image_path, "\n", save_path)
        image = Image.open(image_path)
        width, height = image.size   # Get dimensions

        left = (width - 512)/2
        top = (height - 512)/2
        right = (width + 512)/2
        bottom = (height + 512)/2

        # image = image.crop((left, top, right, bottom))
        image.save(save_path)
        # shutil.copy(image_path, save_path)
        meta_data = image_path[:-4].split("/")[-1].split("_")
        meta_data = {"shared_idx": meta_data[0], "nsd_idx": int(meta_data[1][3:])}
        with open(os.path.join(mlve_path, "train", "meta", f"meta_{i:03d}.pkl"), "wb") as f:
            pickle.dump(meta_data, f)
        print(meta_data)

if __name__=="__main__":
    process_nsd()
