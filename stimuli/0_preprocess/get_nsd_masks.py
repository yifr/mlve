import os
import cv2
import tqdm
import pickle
import numpy as np
import pandas as pd
from PIL import Image
import matplotlib.pyplot as plt
from pycocotools.coco import COCO

"""
Compiling COCO masks:

A. Get COCO ID:
    1. Iterate through NSD metadata, get nsdID
    2. Find corresponding coco ID from NSD indexes
B. For a single COCO image:
    1. Get annotations
    2. Create np array with image dimensions
    3. For each mask area, fill in category ID
    4. Write image to NSD masks
"""

def cocoID_to_mask(coco_anns, cocoID):
    anns = coco_anns.loadAnns(coco_anns.getAnnIds(cocoID))
    masks = None
    for i, ann in enumerate(anns):
        if masks is None:
            masks = coco_anns.annToMask(ann) * (i + ann["category_id"])
        else:
            new_mask = coco_anns.annToMask(ann) * (i + ann["category_id"])
            masks = np.where(new_mask != 0, new_mask, masks)

    return masks

def str_to_float_array(str_arr):
    str_arr = str_arr.strip("()")
    elements = str_arr.split(", ")
    elements = [float(elem) for elem in elements]
    return elements


def crop(mask, crop_dims):
    """ Crop dims is [top, bottom, left, right]

    The cropped dim is in percentage, not pixels
    get height/width of mask, and crop by height * crop_dim
    """
    print("Original mask shape:", mask.shape)
    height, width = mask.shape
    top_crop = int(crop_dims[0] * height)
    bottom_crop = height - int(crop_dims[1] * height)
    left_crop = int(crop_dims[2] * width)
    right_crop = width - int(crop_dims[3] * width)

    mask = mask[top_crop:bottom_crop, left_crop:right_crop]
    print("Cropped mask shape: ", mask.shape)
    if mask.shape != (425, 425):
        mask = cv2.resize(mask, dsize=(425, 425), interpolation=cv2.INTER_NEAREST)

    return mask

def process_NSD():
    nsd_index_path = "/om2/user/yyf/nsd/nsd_stim_info_merged.csv"
    annotation_paths = [f"/om2/user/yyf/coco/annotations/instances_{key}2017.json" \
                   for key in ("train", "val")]

    print("Building Annotations")
    annotations = {"train2017": COCO(annotation_paths[0]),
                   "val2017": COCO(annotation_paths[1])}
    print("Reading in NSD Info")
    nsd_indexes = pd.read_csv(nsd_index_path)

    NSD_path = "/om/user/yyf/mlve/stimuli/nsd/"
    mask_dir = os.path.join(NSD_path, "masks")
    meta_dir = os.path.join(NSD_path, "meta")
    os.makedirs(mask_dir, exist_ok=True)

    for i in tqdm.tqdm(range(100)):
        meta_path = os.path.join(meta_dir, f"meta_{i:03d}.pkl")
        print("Loading image metadata")
        meta_data = pickle.load(open(meta_path, "rb"))
        # Get NSD ID of MLVE stimulus
        nsd_id = meta_data["nsd_idx"]
        nsd_id_info = nsd_indexes.loc[nsd_indexes["nsdId"] == nsd_id]

        coco_split = nsd_id_info["cocoSplit"].values[0]
        coco_id = nsd_id_info["cocoId"].values[0]
        crop_box = str_to_float_array(nsd_id_info["cropBox"].values[0])

        meta_data["nsd_idx"] = int(nsd_id)
        meta_data["coco_split"] = coco_split
        meta_data["coco_id"] = int(coco_id)
        meta_data["cropBox"] = [float(x) for x in crop_box]
        pickle.dump(meta_data, open(meta_path,"wb"))
        
        print("Creating mask")
        coco_anns = annotations[coco_split]
        masks = cocoID_to_mask(coco_anns, coco_id)
        masks = crop(masks, crop_box)
        mask_path = os.path.join(mask_dir, f"mask_{i:03d}.png")
        print("Saving mask to: ", mask_path)
        plt.imsave(mask_path, masks)


if __name__=="__main__":
    process_NSD()
