import os
import sys
import pymongo
import numpy as np
import pandas as pd
import logging 

sys.path.append("../")
import cabutils
from flask import Flask, render_template, request, jsonify

CONN = pymongo.MongoClient("mongodb://localhost:27017/")
DB = CONN["mlve_outputs"]

template_dir = 'templates'
app = Flask(__name__, template_folder=template_dir)
app.logger.setLevel(logging.DEBUG)

@app.route('/')
def index():
    app.logger.info("Serving index.html")
    return render_template('index.html')

@app.route('/get_collection_names', methods=['GET'])
def get_collections():
    col_list = DB.list_collection_names()
    app.logger.debug(f"Fetched Collections: {col_list}")
    return jsonify({"col_list": col_list})
    
@app.route('/get_experiment_data', methods=['GET'])
def get_experiment_data():
    col_name = request.args.get('col_name')
    app.logger.debug(f"Fetching data from collection {col_name}")
    col = DB[col_name]
    data = list(col.find())
    app.logger.debug(f"Fetched data: {data[0]}")
    return jsonify({"data": data})