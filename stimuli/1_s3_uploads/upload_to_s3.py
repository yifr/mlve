import os
import sys
import json
import boto3
import pickle
import logging
from PIL import Image
from tqdm import tqdm
from glob import glob
from botocore.exceptions import ClientError

# import tdw_dataset
credential_path = "/home/yyf/.aws/credentials.json"
credentials = json.load(open(credential_path, "r"))

def get_client():
        s3 = boto3.resource(service_name="s3",
                      aws_access_key_id=credentials.get("aws_access_key_id"),
                      aws_secret_access_key=credentials.get("aws_secret_access_key"))
        return s3


def check_exists(s3, bucket_name, stim_name):
    try:
        s3.Object(bucket_name,stim_name).load()
        return True
    except ClientError as e:
        if (e.response['Error']['Code'] == "404"):
            return False
        else:
            print('Something else has gone wrong with {}'.format(stim_name))

def create_bucket(client, bucket):
    try:
        b = client.create_bucket(Bucket=bucket,
                             CreateBucketConfiguration={
                                 "LocationConstraint": "us-east-2"
                             })
        print('Created new bucket.')
    except Exception as e:
        b = client.Bucket(bucket)
        logging.error(e)

    b.Acl().put(ACL="public-read")
    return b

def upload(client, bucket, s3_path, file_path, overwrite=False):
    """
    Params:
        client: client connected to s3 account
        bucket: str: bucket name
        s3_path: str: path that the file will live at on s3
        file_path: str: path to the file in local storage
    """
    if check_exists(client, bucket_name, s3_path) and not overwrite:
        print(s3_path + " exists on s3. Skipping")
        return

    print("Uploading " + file_path + " to path: " + s3_path)
    client.Object(bucket, s3_path).put(Body=open(file_path,'rb')) ## upload stimuli
    client.Object(bucket, s3_path).Acl().put(ACL='public-read') ## set access controls
    return

def upload_dataset(dataset_root, dataset_name, bucket_name, overwrite=False):
    client = get_client()
    b = create_bucket(client, bucket_name)
    dataset_path = os.path.join(dataset_root, dataset_name)
    files = glob(dataset_path + "/*/*")
    files.sort()
    for fpath in files:
        if os.path.isdir(fpath):
            files = glob(fpath + "/*")
            for fpath in files:
                s3_path = fpath.split(dataset_root)[1].lstrip("/")
                upload(client, bucket_name, s3_path, fpath, overwrite=overwrite)

        s3_path = fpath.split(dataset_root)[1].lstrip("/")
        upload(client, bucket_name, s3_path, fpath, overwrite=overwrite)


if __name__=="__main__":
    dataset_root = "/om/user/yyf/mlve/stimuli"
    dataset_name = sys.argv[1]
    bucket_name = sys.argv[2]
    if "overwrite" in sys.argv:
        overwrite = True
    else:
        overwrite = False
    upload_dataset(dataset_root, dataset_name, bucket_name, overwrite=overwrite)
