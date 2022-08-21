import os
import sys
import json
import glob
sys.path.append("../../")
import cabutils


conn = cabutils.get_db_connection()
proj_name = "thomas_m2s"
version = "v3"
exp_name = "shapenet13." + version
iter_name = "iter-0"
db = conn[proj_name + "_inputs"]
col = db[exp_name]
col.drop()

path = f"/home/yyf/thomas_exp/thomas-m2s-shapenet13-{version}_batches/"
batches = ["exp_trials_batch1.json", "exp_trials_batch2.json"]
familiarization_trials = json.load(open(path + "familiarization_trials.json", "r"))
for i, batch_name in enumerate(batches):
    batch = json.load(open(path + batch_name, "r"))
    print(batch)
    data = {"metadata": {"batch": i, "projName": proj_name, "expName": exp_name, "iterName": iter_name},
            "trials": batch,
            "familiarization_trials": familiarization_trials}
    res = col.insert_one({"data": data})
    print(res)


