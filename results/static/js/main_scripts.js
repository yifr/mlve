var batchIndex = 0;
var trials;
var currentCtx;
var currentModal;
var currentProbeLocation;
var currentExpName;
var currentExpType;
var currentImage;
var currentWidth;
var currentHeight;
var numBatches;
var batchIndex;
var currentExperimentName;
var nsd_dim;
var currentCamera;
var currentScene;

// // Setup ThreeJS
// const metaCanvas = $("#meta-canvas")[0];
// const renderer = new THREE.WebGLRenderer({
//         metaCanvas,
//         alpha: true, // Necessary to make background transparent.
//     });
// // Set background to clear color
// renderer.setClearColor(0x000000, 0);
// renderer.setScissorTest(true);

function renderSceneInfo() {
    // Render the scene info to the modal
    const canvas = $(currentModal).find("canvas")[0];
    camera = currentCamera;
    renderer.setSize(canvas.width, canvas.height);
    var {left, right, top, bottom, width, height} = canvas.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    var positiveYUpBottom = height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);
    renderer.render(currentScene, currentCamera);
    update_threejs();
}

const update_threejs = () => {
    requestAnimationFrame(update_threejs);
    renderer.render(currentScene, currentCamera);
}

function setupScene(probeLocation, averageResponse) {
    const scene = new THREE.Scene();
    const canvas = $(currentModal).find("canvas")[0];
    let cameraRightFulstrum = canvas.width / 100;
    let cameraTopFulstrum = canvas.height / 100;

    const camera = new THREE.OrthographicCamera(
        -cameraRightFulstrum,
        cameraRightFulstrum,
        cameraTopFulstrum,
        -cameraTopFulstrum,
        1,
        1000
    );

    camera.position.set(0, 0, 5);
    scene.add(camera)
    var position = new THREE.Vector3(0, 0, 0);
    var indicator = new KoenderinkCircle(averageResponse, position, 0xff0000, true, 1.);
    scene.add(indicator);
    currentScene = scene;
    currentCamera = camera;
    renderSceneInfo();
}


async function getExperimentData(imageURL, experiment) {
    // Get data from server for this image URL
    const response = await fetch(`/get_experiment_data?` 
                + new URLSearchParams({imageURL: imageURL, experiment: experiment}))
    return response.json();
}

function drawProbe(ctx, x, y, color, image, width, height) {
    // oldClearProbe(ctx, x, y, image, width, height);
    ctx.globalCompositeOperation = "source-over";

    // Draw outer probe on canvas
    ctx.beginPath();
    var x = parseInt(x);
    var y = parseInt(y);
    var radius = 12;

    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(70, 50, 100, 0.5)";
    ctx.fill();

    // Draw inner probe on canvas
    ctx.beginPath();
    var radius = 4;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (color == "green") {
      ctx.fillStyle = "rgba(6, 255, 0, 0.75)";
    } else if (color == "red") {
      ctx.fillStyle = "rgba(255, 6, 0, 0.75)";
    }
    ctx.fill();
    return ctx;
  }

function oldClearProbe(ctx, x, y, image, width, height){
    // Create transparent circle at probe point
    var x = parseInt(x);
    var y = parseInt(y);
    var radius = 12;
    ctx.globalCompositeOperation = "destination-out";
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
}

function clearProbe(ctx, x, y, image, width, height) {
    // Just redraw image
    ctx.drawImage(image, 0, 0, width, height);
}

function flashProbe(ctx, x, y, color, image, width, height, oldClear=false) {
    var clearFunc = oldClear ? oldClearProbe : clearProbe;
    drawProbe(ctx, x, y, color);
    setTimeout(function () {
      clearFunc(ctx, x, y, image, width, height);
    }, 200);
    setTimeout(function () {
      drawProbe(ctx, x, y, color);
    }, 400);
    setTimeout(function () {
        clearFunc(ctx, x, y, image, width, height);
    }, 600);
    setTimeout(function () {
        drawProbe(ctx, x, y, color);
    }, 800);
  }

function flashExistingProbe() {
    if (currentExpType != "surface-normals") {
        var left_point = currentProbeLocation[0];
        var right_point = currentProbeLocation[1];
        console.log(currentCtx);
        flashProbe(currentCtx, left_point[0], left_point[1], "red", currentImage, currentWidth, currentHeight);
        flashProbe(currentCtx, right_point[0], right_point[1], "green", currentImage, currentWidth, currentHeight);
    } else {
        var probe_point = currentProbeLocation;
        flashProbe(currentCtx, probe_point[0], probe_point[1], "red", currentImage, currentWidth, currentHeight);
    }
}

function trunc(num){
    return Number.parseFloat(num).toFixed(3)
}

function renderTrial(batchID, ctx, modal){
    var width;
    var height;
    var trial;
    // Get trial for this batch
    for (var i = 0; i < trials.length; i++) {
        if (trials[i]["batchID"] == batchID) {
            trial = trials[i];
            break;
        }
    }
    var experiment_name = trial["expName"];
    var imageURL = trial["imageURL"];
    var experiment_type = trial["experiment_type"]
    var probe_locations = trial["probeLocation"]
    var gt = trial["gt"]
    
    currentProbeLocation = probe_locations;
    currentExpType = experiment_type;
    currentCtx = ctx;
    if (experiment_name.includes("nsd")){
        width = nsd_dim;
        height = nsd_dim;
    } else {
        width = 512;
        height = 512;
    }
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    var image = new Image(width, height);
    currentImage = image;
    currentWidth = width;
    currentHeight = height;
    image.src = imageURL;
    
    image.onload = () => {
        ctx.drawImage(image, 0, 0, width, height);
        var participant_field = $(modal).find(".participantID")[0]
        var batch_field = $(modal).find(".batchID")[0]
        // $(participant_field).html("<b>Participant ID:</b> " + userID);
        $(batch_field).html(batchIndex);
        var response_field = $(modal).find(".response")[0]
        var prompt_field = $(modal).find(".prompt")[0]
        
        if (experiment_type == "depth") {
            var left_point = probe_locations[0];
            var right_point = probe_locations[1];
            drawProbe(ctx, left_point[0], left_point[1], "red", image, width, height);
            drawProbe(ctx, right_point[0], right_point[1], "green", image, width, height);
            var newPlot = batchIndex > 0 ? false : true;
            plotDepthTrialResults(trials, batchIndex, newPlot);
            $(prompt_field).html("Which dot is closer to the camera?")
            if (gt) {
                var gt_field = $(modal).find(".gt")[0]
                gt = [trunc(gt[0]), trunc(gt[1])]
                $(gt_field).html("Left: " + gt[0] + ", Right: " + gt[1]);
            }
        } else if (experiment_type == "segmentation") {
            var left_point = probe_locations[0];
            var right_point = probe_locations[1];
            drawProbe(ctx, left_point[0], left_point[1], "red", image, width, height);
            drawProbe(ctx, right_point[0], right_point[1], "green", image, width, height);
            var newPlot = batchIndex > 0 ? false : true;
            plotSegmentationTrialResults(trials, batchIndex, newPlot);
            $(prompt_field).html("Are the dots on the same object or not?")
            
            var gt_field = $(modal).find(".gt")[0]
            $(gt_field).html(gt ? "Same Object": "Different Objects");
        } else {
            // Surface Normals
            $(prompt_field).html("Which way is this point facing?")
            $(currentModal).find(".results-plot").empty();
    
            drawProbe(ctx, probe_locations[0], probe_locations[1], "red", image, width, height);
            var avgError = plotSurfaceNormalTrialResults(trials, batchIndex, true);
            var gt_field = $(modal).find(".gt")[0]
            $(gt_field).html("Mean Angular Error: " + trunc(avgError))
            // setupScene(probe_locations, averageResponse);
        }
    }
}

function loadExperimentData(modal_id, imageURL, experiment_name){
    /* Fetches experiment data for a given experiment / image pair 
        Updates trial index for that experiment 
    */
    var modal = $(modal_id);
    var canvas = $(modal).find(".image-canvas")[0]
    var ctx = canvas.getContext("2d");
    currentModal = modal;
    currentCtx = ctx;
    var batchCount = $(modal).find(".batch-count")[0]
    batchIndex = 0;
    $(modal).find(".current-experiment").text(experiment_name);

    getExperimentData(imageURL, experiment_name).then(function(responses) {
        trials = responses["data"]
        // Count number of batches
        max_batch = 0;
        for (var i = 0; i < trials.length; i++) {
            max_batch = Math.max(max_batch, trials[i]["batchID"]);
        }
        numBatches = max_batch + 1;
        expName = trials[0]["expName"];
        // Double check if NSD experiment might have been rendered at 512x512
        nsd_dim = 425;
        if (expName.includes("nsd")) {        
            for(var i = 0; i < trials.length; i ++ ) {
                t = trials[i];
                probeLocation = t["probeLocation"];
                p1 = probeLocation[0];
                p2 = probeLocation[1];
                if(p1[0] >= 425 || p1[1] >= 425 || p2[0] >= 425 || p2[1] >= 425) {
                    nsd_dim = 512;
                }
            }
        }
        console.log(trials)
        var trial = trials[batchIndex]
        $(batchCount).text(`(${batchIndex + 1}/${numBatches})`)
        renderTrial(batchIndex, ctx, modal);
    })
}

async function getExperimentOpts(imageURL) {
    // Get data from server for this image URL
    const response = await fetch(`/get_experiment_opts?` 
                + new URLSearchParams({imageURL: imageURL}))
    return response.json();
}

function loadVisModal(modal_id, imageURL) {
    /* Fetches collection names associated with given image 
        Gets experimentData for the first one 
        and populates a dropdown with the other options
    */
    var modal = $(modal_id);
    getExperimentOpts(imageURL).then(function(data) {
       /* populate list of experiments with data */
       var experiment_opts = data["data"];
       var experiment_list = modal.find(".experiment-list"); 
       $(experiment_list).empty();
       for (var i = 0; i < experiment_opts.length; i++) {
            // Add a new line to the list with experiment name
            const experiment_name = experiment_opts[i]
            if (i == 0) {
                var loadExp = currentExperimentName ? currentExperimentName : experiment_name;
                loadExperimentData(modal_id, imageURL, loadExp);
                $(modal).find(".current-experiment").text(loadExp);
            }
            var new_line = $("<a class='dropdown-item'>" + experiment_name + "</a>");
            $(new_line).on("click", function() {
                console.log("Loading experiment data for experiment: ", experiment_name, " and image: ", imageURL);
                currentExperimentName = experiment_name;
                loadExperimentData(modal_id, imageURL, currentExperimentName);
            });
            experiment_list.append(new_line);
       }
    });
}


$(document).ready(function() {
    function filterImages(dataset) {
        console.log("Filtering dataset: " + dataset)
        currentExperimentName = null;
        images = $(".dataset-image");
        for (var i = 0; i < images.length; i++) {
            var image_id = images[i].id;
            if (dataset.includes("all") ) {
                images[i].style.display = "block";
            }
            else if (image_id.includes(dataset)) {
                images[i].style.display = "block";
            } else {
                images[i].style.display = "none";
            }
        }
    }

    function updateCurrentDataset(dataset) {
        dataset_text = $("#currentDataset");
        dataset_text.text(dataset);
    }

    var current_dataset = "nsd";
    updateCurrentDataset("NSD")
    filterImages(current_dataset);
    
    $(".dataset-option").on("click", function() {
        var selected = $(this).text()
        updateCurrentDataset(selected)
        dataset = selected.toLowerCase();
        filterImages(dataset)
        current_dataset = selected;
    });
    
    $(".next-response").on("click", function() {
        batchIndex = batchIndex + 1;
        if (batchIndex >= numBatches) {
            batchIndex = 0;
        }
        
        batchCount = $(currentModal).find(".batch-count")[0];
        $(batchCount).text(`(${batchIndex + 1}/${numBatches})`)

        renderTrial(batchIndex, currentCtx, currentModal);
    })

    $(".previous-response").on("click", function() {
        batchIndex = batchIndex - 1;
        if (batchIndex < 0) {
            batchIndex = numBatches - 1;
        }
        console.log(batchIndex);
        batchCount = $(currentModal).find(".batch-count")[0];
        $(batchCount).text(`(${batchIndex + 1}/${numBatches})`)

        renderTrial(batchIndex, currentCtx, currentModal);
    })
})

// Function to sort trials by score for a given dataset / experiment type pair
// hits endpoint /sort_trials with params [dataset, experiment_type, order]
function sort_trials() {
    var dataset = $("#currentDataset").text();
    var experiment_type = $("#sortExperimentType").text();
    var order = $("#sort-order").text();

    const response = fetch(`/sort_trials?` 
                + new URLSearchParams({
                    dataset: dataset,
                    experiment_type: experiment_type, 
                    order: order
                })
        ).then(function(data) {  
            console.log(data);
            var sorted = data["sorted"];
            if (!sorted.length) {
                return;
            } else {
                // Sort images on page based on sorted list
                var images = [];
                for (var i = 0; i < sorted.length; i++) {
                    var image_id = sorted[i];
                    var image = $("#" + image_id);
                    images.push(image);
                }
                
            }
        });
}

// const update_threejs = () => {
//     // TODO: should these be switched?
//     requestAnimationFrame(update_threejs);
//     this.renderer.render(this.scene, this.camera);
//   }
  
// var canvas = $("#threejs_covering_canvas")[0];
//         this.scene.background = null;
//         // The canvas will have canvas.width, canvas.height in pixels of order 100
//         // Convert to integers e.g. 1000-by-500 image will become -10, 10, 5, -5,
//         let cameraRightFulstrum = canvas.width / 100;
//         let cameraTopFulstrum = canvas.height / 100;

//         this.camera = new THREE.OrthographicCamera(
//           -cameraRightFulstrum,
//           cameraRightFulstrum,
//           cameraTopFulstrum,
//           -cameraTopFulstrum,
//           1,
//           1000
//         );

//         // camera.position.z = 5;
//         this.camera.position.set(0, 0, 5);
//         // this.camera.position.set(0,100,0);
//         // this.camera.lookAt(this.scene.position);
//         this.renderer = new THREE.WebGLRenderer({
//                 canvas,
//                 alpha: true, // Necessary to make background transparent.
//               });
//         // Set background to clear color
//         this.renderer.setClearColor(0x000000, 0);

//         var posX = trial.arrowPosition[0];
//         var posY = trial.arrowPosition[1];
//         var indicatorPosition = new THREE.Vector3(posX, -posY, 0);

//         if (trial.randomizeArrowInitialDirection) {
//           let randomDirection = new THREE.Vector3().random();
//           // Ensure random direction is facing forward
//           randomDirection.z = Math.abs(randomDirection.z);
//           indicatorDirection
//             .subVectors(randomDirection, indicatorPosition)
//             .normalize();
//         } else {
//           // Look directly at the camera.
//           indicatorDirection
//             .subVectors(this.camera.position, indicatorPosition)
//             .normalize();
//         }

//         // arrow = new THREE.ArrowHelper( arrowDirection, arrowPosition, arrowLength, 0xfffff00, arrowHeadLength, arrowHeadWidth);
//         indicator = new KoenderinkCircle(
//           indicatorDirection,
//           indicatorPosition,
//           INDICATOR_ON_COLOR,
//           true,
//           1.0,
//           this.track
//         );
//         this.scene.add(indicator);

class KoenderinkCircle extends THREE.Object3D {
    constructor(dir, origin, on_color, createInnerRing, alphaval) {
      super();
      this.type = "KoenderinkCircle";
      console.log("Creating KoenderinkCircle" , dir, origin);
      this._axis = new THREE.Vector3();
  
      //LINE
      //this._lineGeometry = new THREE.BufferGeometry();
      //this._lineGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 2, 0],
      //									   3));
      //this.line = new THREE.Line( this._lineGeometry, new THREE.LineBasicMaterial( { color: 0xffff00,
      //										     toneMapped: false,
      //									             linewidth: 8 } ) );
      //this.add( this.line )
  
      //CYLINDER
      var llength = 1;
      this._cylinderGeometry = new THREE.CylinderGeometry(
          0.02,
          0.02,
          llength,
          100
        );
      this.cylinder = new THREE.Mesh(
        this._cylinderGeometry,
        new THREE.MeshBasicMaterial({
          color: on_color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: alphaval,
        })
      );
      this.cylinder.position.set(0, llength / 2, 0);
      this.add(this.cylinder);
  
      //RING
      // this._ringGeometry = new THREE.RingBufferGeometry( 0.5, 1, 100 );
  
      this._ringGeometry = new THREE.TorusGeometry(0.6, 0.04, 100, 100);
      //this.ring = new THREE.Mesh( this._ringGeometry, new THREE.MeshNormalMaterial({side: THREE.DoubleSide}) );
      this.ring = new THREE.Mesh(
        this._ringGeometry,
        new THREE.MeshBasicMaterial({
          color: on_color,
          side: THREE.DoubleSide,
          transparent: true,
          //shadowSide: THREE.FrontSide,
          opacity: alphaval,
        })
      );
      // Rotate the ring such that line is normal to plane the ring lies on.
      this.ring.rotateX(Math.PI / 2);
      this.add(this.ring);
  
      if (createInnerRing) {
        this._ringGeometry2 = new THREE.RingBufferGeometry(0.2, 0.3, 100);
        //this.ring = new THREE.Mesh( this._ringGeometry, new THREE.MeshNormalMaterial({side: THREE.DoubleSide}) );
        this.ring2 = new THREE.Mesh(
          this._ringGeometry2,
          new THREE.MeshBasicMaterial({
            color: on_color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.25,
          })
        );
        //Rotate the ring such that line is normal to plane the ring lies on.
        this.ring2.rotateX(Math.PI / 2);
        this.add(this.ring2);
  
        this._ringGeometry3 = new THREE.RingBufferGeometry(0.05, 0.15, 100);
        //this.ring = new THREE.Mesh( this._ringGeometry, new THREE.MeshNormalMaterial({side: THREE.DoubleSide}) );
        this.ring3 = new THREE.Mesh(
          this._ringGeometry3,
          new THREE.MeshBasicMaterial({
            color: on_color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.25,
          })
        );
        //Rotate the ring such that line is normal to plane the ring lies on.
        this.ring3.rotateX(Math.PI / 2);
        this.add(this.ring3);
      }
  
      this.position.copy(origin);
      this.setDirection(dir);
      //this.updateLineColor();
    }
  
    getDirection() {
      let dir = new THREE.Vector3();
      this.ring.getWorldDirection(dir);
      // For some reason, ring points in opposite direction.
      // Multiply by -1 to get correct direction.
      dir.multiplyScalar(-1);
      return dir.normalize();
    }
  
    setDirection(dir) {
      // dir is assumed to be normalized
  
      if (dir.y > 0.99999) {
        this.quaternion.set(0, 0, 0, 1);
      } else if (dir.y < -0.99999) {
        this.quaternion.set(1, 0, 0, 0);
      } else {
        this._axis.set(dir.z, 0, -dir.x).normalize();
  
        const radians = Math.acos(dir.y);
  
        this.quaternion.setFromAxisAngle(this._axis, radians);
      }
    }
  
    updateLineColor() {
      // TODO: Why does color work correctly only on the front half, not the back half?
      this.line.material.color.set(vecToSurfaceNormalRGB(this.getDirection()));
    }
  }
  
  class ResourceTracker {
    constructor() {
      this.resources = new Set();
    }
    track(resource) {
      if (resource.dispose || resource instanceof THREE.Object3D) {
        this.resources.add(resource);
      }
      return resource;
    }
    untrack(resource) {
      this.resources.delete(resource);
    }
    dispose() {
      for (const resource of this.resources) {
        if (resource instanceof THREE.Object3D) {
          if (resource.parent) {
            resource.parent.remove(resource);
          }
        }
        if (resource.dispose) {
          resource.dispose();
        }
      }
      this.resources.clear();
    }
  }
  
  