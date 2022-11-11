import os
import sys
import h5py
import torch
import pickle
import numpy as np
from glob import glob
from PIL import Image
import torchvision.transforms as T
from torch.utils.data import Dataset as TorchDataset

IMAGE_PASS_OPTS = ['depths', 'images', 'normals', 'masks']
DATASET_OPTS = ["gestalt_shapegen", "hypersim_v2", "nsd", "tdw"]

class DatasetLoader(TorchDataset):

    def __init__(self, root_dir, dataset, image_passes):
        assert dataset in DATASET_OPTS

        for image_pass in image_passes:
            assert image_pass in IMAGE_PASS_OPTS

        self.root_dir = root_dir
        self.dataset = dataset
        self.data_dir = os.path.join(self.root_dir, self.dataset)
        self.image_passes = image_passes
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    def __getitem__(self, idx):
        data = {}
        for image_pass in self.image_passes:
            path = os.path.join(self.data_dir, image_pass, f"{image_pass[:-1]}_{idx:03d}")
            if image_pass == "normals" or image_pass == "depths":
                path += ".hdf5"
                pass_data = torch.tensor(h5py.File(path, "r")["dataset"][:])
                pass_data = pass_data.to(self.device)
                if image_pass == "depths":
                    pass_data = pass_data.unsqueeze(0)
                else:
                    pass_data = pass_data.permute(2, 0, 1)
                data[image_pass] = pass_data
            else:
                path += ".png"
                pass_data = Image.open(path)
                if image_pass == "masks":
                    pass_data = pass_data.convert("L")

                data[image_pass] = T.functional.pil_to_tensor(pass_data)
                data[image_pass] = data[image_pass].to(self.device)


        return data

    def __len__(self):
        return 100
