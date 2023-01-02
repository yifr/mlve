/* Plotly function to generate a bar plot
    for categorical data. 
    For example: given trials of depth task
    count up responses for (0, 1, 2) which 
    correspond to (left, right, same) and
    plot the results.
*/
function plotDepthTrialResults(data, batchID, newPlot){
    var imageURL = data[0]["imageURL"];
    var responses = {x: ["Left", "Right", "Same"], y: [0, 0, 0], type: 'bar'};
    var correct = ["", "", ""];
    var checkGT = true;
    for (var i = 0; i < data.length; i ++ ) {
        trial = data[i];
        if (trial["batchID"] == batchID) {
            if (trial["gt"] && checkGT) {
                if (trial["gt"][0] < trial["gt"][1]) {
                    correct[0] = "Correct Answer";
                    responses["x"][0] = responses["x"][0] + " (Correct)"
                } else if (trial["gt"][0] > trial["gt"][1]) {
                    correct[1] = "Correct Answer";
                    responses["x"][1] = responses["x"][1] + " (Correct)"
                } else {
                    correct[2] = "Correct Answer";
                    responses["x"][2] = responses["x"][2] + " (Correct)"
                }
                checkGT = false;
            }
            var resp = parseInt(trial["response"]);
            responses["y"][resp] += 1;
        }
    }
    var layout = {
        title: 'Aggregate Responses for Probe Location #' + batchID,
        autosize: false,
        width: 500,
        height: 500,
    };
    responses["text"] = correct; 
    if (newPlot) {
        Plotly.newPlot(`stat-results-${imageURL}`, [responses], layout);
    } else {
        Plotly.react(`stat-results-${imageURL}`, [responses], layout);
    }
}


function plotSegmentationTrialResults(data, batchID, newPlot){
    var imageURL = data[0]["imageURL"];
    var responses = {x: ["Different", "Same"], y: [0, 0], type: 'bar'};
    var correct = ["", ""];
    var checkGT = true;
    for (var i = 0; i < data.length; i ++ ) {
        trial = data[i];
        if (trial["batchID"] == batchID) {
            if (checkGT) {
                if (trial["gt"]) {
                    correct[1] = "Correct Answer";
                    responses["x"][1] = responses["x"][1] + " (Correct)"
                } else {
                    correct[0] = "Correct Answer";
                    responses["x"][0] = responses["x"][0] + " (Correct)"
                }
                checkGT = false;
            }
            var resp = parseInt(trial["response"]);
            responses["y"][resp] += 1;
        }
    }
    var layout = {
        title: 'Aggregate Responses for Probe Location #' + batchID,
        autosize: false,
        width: 500,
        height: 500,
    };
    responses["text"] = correct;
    if (newPlot) {
        Plotly.newPlot(`stat-results-${imageURL}`, [responses], layout);
    } else {
        Plotly.react(`stat-results-${imageURL}`, [responses], layout);
    }
}

function getAverageSurfaceNormalResponse(trials, batchIndex) {
    // Loop through trials and get surface normal responses
    // Average the responses, normalize the average and return
    var avgResponse = new THREE.Vector3(0, 0, 0)
    var numTrials = trials.length;
    for (var i = 0; i < numTrials; i ++){ 
        if (trials[i]["batchID"] == batchIndex) {
            var resp = new THREE.Vector3(trials[i]["response"][0], trials[i]["response"][1], trials[i]["response"][2]);
            avgResponse.add(resp);
        }
    }
    avgResponse.divideScalar(numTrials);
    avgResponse.normalize();
    return avgResponse;
}

function meanAngularError(vec1, vec2) {
    // compute mean angular error between two vectors
    // vec1 and vec2 are THREE.Vector3 objects
    var dot = vec1.dot(vec2);
    var angle = Math.acos(dot) * 180 / Math.PI;
    return angle;
}

function plotSurfaceNormalTrialResults(trials, batchID, newPlot) {
    // Create a 3D cone plot with averaged surface normal response 
    // and ground truth surface normal if relevant
    // Position the camera so that the cone is in view

    var imageURL = trials[0]["imageURL"];
    var averageResponse = getAverageSurfaceNormalResponse(trials, batchID);

    var data = [{
        type: 'cone',
        name: "Average Response",
        hoverinfo: "name+u+v+w",
        x: [0],
        y: [0],
        z: [0],
        u: [averageResponse.x],
        v: [averageResponse.y],
        w: [averageResponse.z],
        sizemode: 'absolute',
        sizeref: 1,
        anchor: 'tail',
        colorscale: [[0, 'rgb(0,0,0)'], [1, 'rgb(255, 0, 0)']]
    }];

    avgError = "N/A";
    batchTrial = trials.filter(trial => trial["batchID"] == batchID)[0];
    if (batchTrial["gt"]) {
        var gt = batchTrial["gt"];
        avgError = meanAngularError(averageResponse, new THREE.Vector3(gt[0], gt[1], gt[2]));
        avgError = avgError;
        
        var gt_data = {
            type: 'cone',
            name: "Ground Truth",
            hoverinfo: "name+u+v+w",
            x: [0],
            y: [0],
            z: [0],
            u: [gt[0]],
            v: [gt[1]],
            w: [gt[2]],
            sizemode: 'absolute',
            sizeref: 1,
            anchor: 'tail',
            colorscale: [[0, 'rgb(0,0,0)'], [1, 'rgb(0,0,255)']]
        }
        data.push(gt_data);
    }
    var layout = {
        title: 'Aggregate Responses for Probe Location #' + batchID,
        autosize: false,
        width: 500,
        height: 500,
        scene: {
            camera: {
                up: {x: 0, y: 1, z: 0},
                center: {x: 0, y: 0, z: 0},
                eye: {x: 0, y: 0, z: 1.5}
            },
            xaxis: {
                type: 'linear',
                zeroline: false
            },
            yaxis: {
                type: 'linear',
                zeroline: false
            },
            zaxis: {
                type: 'linear',
                zeroline: false
            }
        }
    };
    console.log(data)
    if (newPlot) {
        Plotly.newPlot(`stat-results-${imageURL}`, data, layout);
    } else {
        Plotly.react(`stat-results-${imageURL}`, data, layout);
    }
    return avgError;
}