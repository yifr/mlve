var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var projName = urlParams.get("projName");
var expName = urlParams.get("expName");
var iterName = urlParams.get("iterName");
var imagesAsNormals = urlParams.get("imagesAsNormals");

var canvas = $("#threejs_covering_canvas")[0];
var renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true, // Necessary to make background transparent.
      });
// Set background to clear color
renderer.setClearColor(0x000000, 0);


var inputID = null; // ID unique to the session served
// var platform = urlParams.get("platform");

/****************************************************
  If you have any other URL Parameters that you need
  for your experiment, read them in them here.
  ie;
  var dominoNumbers = urlParams.get("num_dominos")
*****************************************************/

function launchExperiment() {
  var stimInfo = {
    proj_name: projName,
    exp_name: expName,
    iter_name: iterName,
  };

  if (DEBUG_MODE) {
    console.log(
      "Project Name: ",
      projName,
      "Experiment Name: ",
      expName,
      "iteration Name: ",
      iterName,
      "stimInfo",
      stimInfo
    );
  }

  socket.emit("getResults", stimInfo);

  socket.on("results", (sessionResults) => {
    visualizeResults(sessionResults);
  });
}

/*
Visualize Surface Normal Results:
  1. Fetch result data
  2. Sort by user
  3. For each image, add canvas with image and mark image as rendered (in a set somewhere)
  4. For each trial, add ground truth arrow and mark pixel position as done for ground truth arrow
  5. Render koenderink indicator for user direction
*/
function visualizeResults(sessionResults) {
  
  var arrowPosition = trialData["arrowPixelPosition"];
  var arrowDirection = trialData["trueArrowDirection"];

    var imageURL = imagesAsNormals ? trialData["normalImageURL"] : trialData["imageURL"];
    trialType = (i < 3) ? "supervised" : "reinforcement";
    var trial = {
      type: surfaceNormalsTask,
      imageURL: imageURL,
      trialType: trialType,
      arrowPosition: trialData["arrowPosition"],
      randomizeArrowInitialDirection: trialData["randomizeArrowInitialDirection"],
      trueArrowDirection: trialData["trueArrowDirection"],
      index: i,
      indicatorType: indicatorType,
      arrowPixelPosition: trialData["arrowPixelPosition"]
    }
    trials.push(trial)
  }


