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

def tdw_main():
    bucket = "tdw-scenes"
    s3 = get_client()
    b = create_bucket(s3, bucket)
    dataset = tdw_dataset.TDWDataset("/om2/user/yyf/tdw_playroom_small", training=False)
    for i in tqdm(range(130)):
        image, masks, file_path = dataset.__getitem__(i)
        s3_path = file_path.split("/om2/user/yyf/")[1]
        upload(s3, bucket, s3_path, file_path)


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
    bucket = "gestalt-scenes"
    upload_video = True
    upload_ground_truth = True
    upload_2afc = False
    upload_train = False
    overwrite = False

    s3 = get_client()
    b = create_bucket(s3, bucket)
    root_path = "/om/user/yyf/CommonFate/scenes"

    if upload_train:
        for texture in ["train_noise", "train_voronoi", "train_wave"]:
            for obj_split in [f"superquadric_{i}" for i in range(1, 5)]:
                for i in range(2):
                    scene_dir = os.path.join(root_path, texture, obj_split, f"scene_{i:03d}")
                    if upload_video:
                        if not os.path.exists(os.path.join(scene_dir, f"scene_{i:03d}.mp4")):
                            video_path = render_video(scene_dir, f"scene_{i:03d}.mp4")
                        upload(video_path, root_path, s3, bucket, overwrite)
                        delete(video_path)

                    for file_path in tqdm(glob(scene_dir + "/masks/*.png")):
                        upload(file_path, root_path, s3, bucket, overwrite)

    if upload_ground_truth:
        print("Uploading Ground Truth")
        scene_dirs = os.path.join(root_path, "test_ground_truth/superquadric_1/*") # Upload PNGs
        for scene_dir in tqdm(glob(scene_dirs)):
            if upload_video:
                scene = scene_dir.split("/")[-1]
                print(scene_dir)
                video_path = render_video(scene_dir, f"{scene}.mp4")
                upload(video_path, root_path, s3, bucket, overwrite)
                delete(video_path)
            if "shaded" in scene_dir or "images" in scene_dir:
                upload(fscene_dir, root_path, s3, bucket, overwrite)

    elif upload_2afc:
        data_path = root_path + "/media/2-afc/*"
        for file_path in tqdm(glob(data_path)):
            upload(file_path, root_path, s3, bucket, overwrite)
    else:
        for texture in ["test_noise", "test_voronoi", "test_wave"]:
            for obj_split in [f"superquadric_{i}" for i in range(1,5)]:
                scene_dirs = glob(os.path.join(root_path, texture, obj_split, "*"))
                for scene_dir in scene_dirs:
                    print("scene_dir: ", scene_dir)
                    if upload_video:
                        scene = scene_dir.split("/")[-1]
                        if not os.path.exists(os.path.join(scene_dir, f"{scene}.mp4")):
                            video_path = render_video(scene_dir, f"{scene}.mp4")
                        upload(video_path, root_path, s3, bucket, overwrite)
                        delete(video_path)

        data_path = root_path + "/test_*/**/*/images/*" # Upload everything else
        for file_path in tqdm(glob(data_path)):
            if "." in file_path:
                upload(file_path, root_path, s3, bucket, overwrite)

    # target = "detection_pilot_batch_0.csv"
    # s3.Object(bucket, target).put(Body=open(target, "rb"))
    # s3.Object(bucket, target).Acl().put(ACL="public-read")

if __name__=="__main__":
    main()
