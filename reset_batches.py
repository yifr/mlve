from tqdm import tqdm
import cabutils
import pymongo
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("--db", type=str, required=True, help="The analagous URL parameter is projName")
parser.add_argument("--colName", type=str, required=True, help="Analagous URL parameter: expName")
args = parser.parse_args()

# Make sure to ssh into the experiment server before running this script.
# You might need to change the path to the pem key, but the command should look like:
# ssh -i ~/.aws/cocosci_ec2.pem -NL 27017:localhost:27017 ubuntu@ec2-34-228-26-201.compute-1.amazonaws.com

conn = cabutils.get_db_connection()
db = conn[args.db + "_inputs"]
col = db[args.colName]
num_batches = col.count_documents(filter={})

print(f"Found col ({args.colName}) in db ({args.db}). Resetting batch hits for all {num_batches} batches.")
for i, num_hits in tqdm(enumerate(range(num_batches))):
    res = col.update_one({"batch": i}, {"$set": {"numGames": 0}})

print("Done.")
