import os
import sys
import json
import boto3
import logging
import h5py
from tqdm import tqdm
from glob import glob
from botocore.exceptions import ClientError
from argparse import ArgumentParser

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
    if check_exists(client, bucket, s3_path) and not overwrite:
        print(s3_path + " exists on s3. Skipping")
        return

    print("Uploading " + file_path + " to path: " + s3_path)
    client.Object(bucket, s3_path).put(Body=open(file_path,'rb')) ## upload stimuli
    client.Object(bucket, s3_path).Acl().put(ACL='public-read') ## set access controls
    return


def delete(file_path):
    os.remove(file_path)

def render_video(root_path, video_name):
    output_path = os.path.join(root_path, video_name)
    img_path = os.path.join(root_path, "images")
    cmd = f"ffmpeg -y -framerate 20 -i {img_path}/Image%04d.png \
            -pix_fmt yuv420p -c:v libx264 {output_path}"
    os.system(cmd)
    return output_path

def upload(file_path, root_path, s3, bucket, overwrite=False):
    target = file_path.split(root_path)[1]
    target = target.strip("/") # Remove any leading or trailing slashes
    if check_exists(s3, bucket, target) and not overwrite:
        print(target + " exists. Skipping")
        return

    s3.Object(bucket, target).put(Body=open(file_path,'rb')) ## upload stimuli
    s3.Object(bucket, target).Acl().put(ACL='public-read') ## set access controls


def main():
    bucket = "ml-hypersim-scenes"
    overwrite = False

    s3 = get_client()
    b = create_bucket(s3, bucket)
    root_path = "/om/user/yyf/hypersim/"
    scenes = glob(root_path + "*")
    for scene in tqdm(scenes):
        image_dir = os.path.join(scene, "images", "scene_cam_00_geometry_preview")
        image_files = glob(image_dir + "/*normal_cam.png")
        if len(image_files) < 1:
            print("Scene has no files: ", image_dir)
            continue

        image_files.sort()
        last_img = image_files[-1]
        upload(last_img, root_path, s3, bucket, overwrite=False)

if __name__=="__main__":
    parser = ArgumentParser()
    parser.add_argument("--frame_idx", type=int, default=99)
    main()
