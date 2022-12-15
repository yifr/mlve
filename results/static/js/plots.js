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
