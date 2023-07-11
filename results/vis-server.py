import os
import sys
import json
import pymongo
import numpy as np
import pandas as pd
import logging
from bson import json_util

sys.path.append("../")
import cabutils
from flask import Flask, render_template, request, jsonify

CONN = pymongo.MongoClient("mongodb://localhost:27017/")
DB = CONN["mlve_results"]

"""
Backend Server for Visualizations:

 - We want to be able to visualize individual responses for trials on a given experiment
 - For a given url, participant ID, condition, etc. we want to return trial data
 - Backend should filter data based on given parameters and return relevant trial information
 - Filters in db include:
        "ID": obscured user ID,
        "imageURL": image URL,
        "gt": ground truth answer (if exists),
        "response": user response,
        "score": accuracy / correct (if exists),
        "probeLocation": probe location(s),
        "batchID": batch ID,
        "expName": experiment name,
        "iterationName": iteration name (not super useful),

 - Front end design is something like:
    Image URL > experiment type (expName) > ID / probeLocation / batchID
"""

template_dir = 'templates'
app = Flask(__name__, template_folder=template_dir)

app.logger.setLevel(logging.DEBUG)

@app.route('/')
def index():
    app.logger.info("Serving index.html")
    urls = DB["results"].distinct("imageURL")
    filtered_urls = {"NSD": [], "Gestalt": [], "Hypersim": [], "TDW": []}
    for url in urls:
        if "nsd" in url:
            filtered_urls["NSD"].append(url)
        elif "gestalt_shapegen" in url:
            filtered_urls["Gestalt"].append(url)
        elif "hypersim_v3" in url:
            filtered_urls["Hypersim"].append(url)
        elif "tdw" in url:
            filtered_urls["TDW"].append(url)

    urls = filtered_urls
    return render_template('index.html', urls=urls)


# Add endpoint to sort stimuli from worst to best
# by score (if exists) on a given experiment type
@app.route('/sort_trials', methods=['GET'])
def sort_trials():
    exp_type = request.args.get('experiment_type')
    dataset = request.args.get('dataset')
    order = request.args.get('order')
    app.logger.debug(f"Sorting trials for experiment type: {exp_type} and dataset: {dataset}")
    col = DB["results"]
    if dataset == "all":
        data = list(col.find({"experiment_type": exp_type}))
    else:
        data = list(col.find({"experiment_type": exp_type, "dataset": dataset}))

    # For each image, get the average score over all the batches
    # Then sort the images by average score
    data = pd.DataFrame(data)
    urls = data["imageURL"].unique()
    scores = []
    if data.iloc[0]["score"] is None:
        return jsonify({"sorted": []})

    for url in urls:
        score = data[data["imageURL"] == url]["score"].mean()
        scores.append((url, score))

    if exp_type == "surface-normals":
        for i in range(len(scores)):
            scores[i][1] = 1 - (score[i][1] / 180) # surface normal score is mean angular error, so best is 0, worst is 180

    scores.sort(key=lambda x: x[1], reverse=order == "worst")
    sorted_urls = [x[0] for x in scores]
    return jsonify({"sorted": sorted_urls})


def parse_json(data):
    return json.loads(json_util.dumps(data))

@app.route('/get_experiment_data', methods=['GET'])
def get_experiment_data():
    imageURL = request.args.get('imageURL')
    expName = request.args.get('experiment')
    app.logger.debug(f"Fetching data for image URL: {imageURL} and experiment: {expName}")
    col = DB["results"]
    data = list(col.find({"imageURL": imageURL, "expName": expName}))
    app.logger.debug(f"Fetched {len(data)} records")
    data.sort(key=lambda x: x["batchID"])
    return parse_json({"data": data})

@app.route("/grid_grouping", methods=["GET"])
def serve_grid_grouping_results():
    return render_template('grid_grouping.html')

@app.route('/get_experiment_opts', methods=['GET'])
def get_experiment_opts():
    # return possible experiments for given image URL
    url = request.args.get('imageURL')
    app.logger.debug(f"Fetching data for image URL: {url}")
    col = DB["results"]
    experiments = list(col.distinct("expName", {"imageURL": url}))
    app.logger.debug(f"Found {len(experiments)} distinct experiments for {url}")
    return parse_json({"data": experiments})
