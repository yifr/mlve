import boto3
import json
from glob import glob
from PIL import Image
import numpy as np
from tqdm import tqdm
import os

credential_path = "/home/yyf/.aws/credentials.json"
credentials = json.load(open(credential_path, "r"))
def get_client():
    s3 = boto3.client(service_name="s3",
                  aws_access_key_id=credentials.get("aws_access_key_id"),
                  aws_secret_access_key=credentials.get("aws_secret_access_key"))
    return s3

gestalt_dir = "/om/user/yyf/CommonFate/scenes/"
texture_dirs = "test_*"
object_dirs = "*"
scene_dirs = glob(os.path.join(gestalt_dir, texture_dirs, object_dirs, '*scene=0'))

scene_idxs = set(range(100))
scene_order = []

# For each scene directory, load masks for last frame
# for each remaining scene on AWS, check if the masks match
# if the masks match, store the scene path with the order index
s3 = get_client()
for scene_dir in scene_dirs:
    mask_path = os.path.join(scene_dir, "masks", "Image0064.png")
    mask = np.array(Image.open(mask_path).convert("L"))
    print("Finding mask for scene dir: ", scene_dir)
    for scene_idx in tqdm(scene_idxs):
        # Download image:
        with open("tmp.png", "wb") as f:
            s3.download_fileobj("mlve-v1", f"gestalt/masks/mask_{scene_idx:03d}.png", f)

        tmp_masks = np.array(Image.open("tmp.png").convert("L"))
        if (tmp_masks == mask).all():
            print("Match found!", scene_idx)
            scene_order.append((scene_idx, scene_dir))
            scene_idxs.remove(scene_idx)
            match_found = True
            break

        if not match_found:



print(scene_order)
scene_order.sort(key = lambda x: x[0])
print(scene_order)
with open("gestalt_order.npy", "wb") as f:
    np.save(f, np.array(scene_order))

with open("shapegen_order.txt", "w") as f:
    for i, scene in scene_order:
        f.write(scene + "\n")
