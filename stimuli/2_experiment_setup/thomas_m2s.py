import os
import sys
import json
import glob

def get_db_connection(connectionTimeoutMS=5000):
    """get DB connection.
       user-level config file must exist (see above) and have a
       section with the form:

       [DB]
       username=[...]
       password=[...]
    """
    configs = get_cab_configs()
    user = "cabUser"
    pwd = "miwokPetaluuma"
    host = "localhost"
    port = "27017"
    connstr = "mongodb://%s:%s@%s:%s" % (user, pwd, host, port)
    conn = pm.MongoClient(connstr, serverSelectionTimeoutMS=connectionTimeoutMS)
    print("Checking database connection...")
    conn.server_info()
    print("Connection established!")
    return conn

# Make sure you have a port open to the EC2 server before trying to connect to the database
MONGO_PORT = 27017 # This should agree with the MONGODB_PORT value is settings.conf
os.exec["ssh -i ~/.ssh/Cocosci_WebExperiments.pem -NL {MONGO_PORT}:localhost:27017 ubuntu@ec2-34-228-26-201.compute-1.amazonaws.com"]

conn = get_db_connection()
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


# You should then be able to access your experiment at the following url (swapping out the {VALUE} variables for their actual values):
# http://34.228.26.201:8080/m2s.html?projName={PROJ_NAME}&expName={EXP_NAME}&iterName={ITER_NAME}
