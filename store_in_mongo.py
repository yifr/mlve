import os
import json
import cabutils
import pymongo
from glob import glob

experiment_name = "gestalt_static_localization"
conn = cabutils.get_db_connection()
db = conn["mlve" + "_inputs"]
col = db[experiment_name]
col.drop()
print("Created col: ", col)
experiment_config_dir = os.path.join("experiments", "configs", experiment_name) + "/*"
print(experiment_config_dir)
experiment_configs = glob(experiment_config_dir)
for experiment_config in experiment_configs:
    data = json.load(open(experiment_config, "r"))
    print("storing " + experiment_config + " in collection...")
    res = col.insert_one(data)
    print("result: ", res)
