import os
import sys
import json
import boto3
import logging
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
    if check_exists(client, bucket, s3_path) and not overwrite:
        print(s3_path + " exists on s3. Skipping")
        return

    print("Uploading " + file_path + " to path: " + s3_path)
    client.Object(bucket, s3_path).put(Body=open(file_path,'rb')) ## upload stimuli
    client.Object(bucket, s3_path).Acl().put(ACL='public-read') ## set access controls
    return

def tdw_main():
    bucket = "tdw-scenes"
    s3 = get_client()
    b = create_bucket(s3, bucket)
    dataset = tdw_dataset.TDWDataset("/om2/user/yyf/tdw_playroom_small", training=False)
    for i in tqdm(range(130)):
        image, masks, file_path = dataset.__getitem__(i)
        s3_path = file_path.split("/om2/user/yyf/")[1]
        upload(s3, bucket, s3_path, file_path)

def main():
    bucket = "gestalt-scenes"
    upload_ground_truth = False
    upload_2afc = True

    s3 = get_client()
    b = create_bucket(s3, bucket)
    root_path = "/om/user/yyf/CommonFate/"
    overwrite = False

    if upload_ground_truth:
        data_path = root_path + "/test_ground_truth/superquadric_1/*/*/*" # Upload PNGs
        for file_path in tqdm(glob(data_path)):
            if "shaded" in file_path or "masks" in file_path:
                target = file_path.split(root_path)[1][1:]
                if check_exists(s3, bucket, target) and not overwrite:
                    print(target + " exists. Skipping")
                    continue

                print(target)
                s3.Object(bucket, target).put(Body=open(file_path,'rb')) ## upload stimuli
                s3.Object(bucket, target).Acl().put(ACL='public-read') ## set access controls

    elif upload_2afc:
        data_path = root_path + "/media/2-afc/*"
        for file_path in tqdm(glob(data_path)):
            target = file_path.split(root_path)[1][1:]
            if check_exists(s3, bucket, target) and not overwrite:
                print(target + " exists. Skipping")
                continue

            s3.Object(bucket, target).put(Body=open(file_path,'rb')) ## upload stimuli
            s3.Object(bucket, target).Acl().put(ACL='public-read') ## set access controls
    else:
        data_path = root_path + "/test_*/**/*/images/*" # Upload everything else
        for file_path in tqdm(glob(data_path)):
            if "." in file_path:
                target = file_path.split(root_path)[1][1:]
                if check_exists(s3, bucket, target) and not overwrite:
                    print(target + " exists. Skipping")
                    continue
                s3.Object(bucket, target).put(Body=open(file_path,'rb')) ## upload stimuli
                s3.Object(bucket, target).Acl().put(ACL='public-read') ## set access controls
                # print(target)

    # target = "detection_pilot_batch_0.csv"
    # s3.Object(bucket, target).put(Body=open(target, "rb"))
    # s3.Object(bucket, target).Acl().put(ACL="public-read")

if __name__=="__main__":
    main()
