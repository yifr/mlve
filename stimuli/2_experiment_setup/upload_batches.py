import os
import sys
import json
import random
import pickle
import datetime
sys.path.append("../")
from utils import probes
sys.path.append("../../")
import cabutils
from argparse import ArgumentParser

parser = ArgumentParser()

parser.add_argument("--dataset", type=str, required=True)
parser.add_argument("--experiment_type", type=str, required=True, help="choice: [surface-normals, depth-estimation, object-loc]")
parser.add_argument("--experiment_name_addons", type=str, default="", help="additional tags for experiment name")
parser.add_argument("--batch_dir", help="directory to find batches", type=str, required=True)
parser.add_argument("--iter_name", type=str, help="name for server to index on when serving experiments", required=True)
parser.add_argument("--start_batch", type=int, required=True)
parser.add_argument("--end_batch", type=int, required=True)
args = parser.parse_args()

def main():
    conn = cabutils.get_db_connection()

    proj_name = "mlve"
    exp_name = args.dataset + "-" + args.experiment_type
    if args.experiment_name_addons:
        exp_name = exp_name + "-" + args.experiment_name_addons

    metadata = {"proj_name": "mlve", "exp_name": exp_name, "iter_name": args.iter_name}

    print("Generating Experiment trials: ", metadata)
    db = conn[proj_name + "_inputs"]
    col = db[exp_name]

    for batch_num in range(args.start_batch, args.end_batch):
        batch_path = f"datasets/{exp_name}/{args.batch_dir}/batch_{batch_num}.json"
        print("Uploading batch data: ", batch_path)
        with open(batch_path, "r", encoding='utf-8') as f:
            data = json.load(f)
            print(data.keys())
        metadata["batch_idx"] = batch_num
        data["metadata"] = metadata
        data["iterName"] = args.iter_name
        res = col.insert_one({"data": data})

    print(f"Experiment URL: http://34.228.26.201:8080/{args.experiment_type}.html?projName=mlve&expName={exp_name}&iterName={args.iter_name}&debug=true")

if __name__=="__main__":
    main()
