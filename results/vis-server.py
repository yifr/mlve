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
    return parse_json({"data": data})

@app.route('/get_experiment_opts', methods=['GET'])
def get_experiment_opts():
    # return possible experiments for given image URL
    url = request.args.get('imageURL')
    app.logger.debug(f"Fetching data for image URL: {url}")
    col = DB["results"]
    experiments = list(col.distinct("expName", {"imageURL": url}))
    app.logger.debug(f"Found {len(experiments)} distinct experiments for {url}")
    return parse_json({"data": experiments})