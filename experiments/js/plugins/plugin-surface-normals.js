/**
 * jspsych-surface-normals
 * Rylan Schaeffer / Dan Yamins
 *
 * plugin for displaying a click-draggable surface normal vector.
 *
 **/

jsPsych.plugins["jspsych-surface-normals"] = (function () {
  var plugin = {};
  var canvasWidthPercent = 0.8;
  var canvasHeightPercent = 0.8;

  plugin.info = {
    name: "jspsych-surface-normals",
    parameters: {
      imageURL: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "imageURLs",
        default: undefined,
        array: true,
        description: "The URL for the image cues.",
      },
      cue_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "cue_duration",
        default: 1000,
        description: "How long to show the cue (in milliseconds).",
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "prompt",
        default: null,
        description: "What to display to the participant as the instructions.",
      },
    },
  };

  INDICATOR_ON_COLOR = 0xff00ff;
  INDICATOR_OFF_COLOR = 0x000000;

  TRUE_INDICATOR_ON_COLOR = 0xff00ff;
  TRUE_INDICATOR_OFF_COLOR = 0x000000;

  IN_TRIAL = false;
  _current_trial = null;

  radius = 5;
  radiusSquared = radius * radius;
  rotationQuaternion = new THREE.Quaternion();
  rotate_indicator = false;

  mouseStartOrthographicPosition = new THREE.Vector3();
  mousePenultimateOrthographicPosition = new THREE.Vector3();
  mouseCurrentOrthographicPosition = new THREE.Vector3();
  distanceCurrentMinusPenultimate = new THREE.Vector3();
  negativeZVector = new THREE.Vector3(0, 0, -1);
  errorThreshold = 0.2;

  function setMouseCurrentOrthographicPosition(event) {
    let canvasBoundingBox = canvas.getBoundingClientRect();
    let sketchpadCurrentHeight =
      canvasBoundingBox.bottom - canvasBoundingBox.top;
    let sketchpadCurrentWidth =
      canvasBoundingBox.right - canvasBoundingBox.left;

    // Compute mouse location relative to canvasBoundingBox, then normalize to [-1, 1]
    // I think this is correct

    pointer.x =
      ((event.clientX - canvasBoundingBox.left) / sketchpadCurrentWidth) * 2 -
      1;
    pointer.y =
      -((event.clientY - canvasBoundingBox.top) / sketchpadCurrentHeight) * 2 +
      1;

    // First computes location of mouse on z=0 plane
    // See: https://stackoverflow.com/a/13091694/4570472
    // Third argument is irrelevant.
    mouseCurrentOrthographicPosition.set(pointer.x, pointer.y, 0);

    // Projects from ThreeJS-independent "normalized device coordinate space" (i.e. -1 to 1)
    // to "world space" i.e. the coordinates used by ThreeJS
    mouseCurrentOrthographicPosition.unproject(camera);

    return mouseCurrentOrthographicPosition;
  }

  document.addEventListener("click", function (event) {
    if (IN_TRIAL) {
      if (!rotate_indicator) {
        console.log("enabling indicator");
        mouseStartOrthographicPosition.copy(
          setMouseCurrentOrthographicPosition(event)
        );
        mousePenultimateOrthographicPosition.copy(
          mouseStartOrthographicPosition
        );
        rotate_indicator = true;
        indicator.ring.material.color.setHex(INDICATOR_ON_COLOR);
        indicator.ring2.material.color.setHex(INDICATOR_ON_COLOR);
        indicator.ring3.material.color.setHex(INDICATOR_ON_COLOR);
        indicator.cylinder.material.color.setHex(INDICATOR_ON_COLOR);
        trueIndicator.ring.material.color.setHex(TRUE_INDICATOR_ON_COLOR);
        trueIndicator.cylinder.material.color.setHex(TRUE_INDICATOR_ON_COLOR);
      } else {
        console.log("disabling indicator");
        rotate_indicator = false;
        indicator.ring.material.color.setHex(INDICATOR_OFF_COLOR);
        indicator.ring2.material.color.setHex(INDICATOR_OFF_COLOR);
        indicator.ring3.material.color.setHex(INDICATOR_OFF_COLOR);
        indicator.cylinder.material.color.setHex(INDICATOR_OFF_COLOR);
        trueIndicator.ring.material.color.setHex(TRUE_INDICATOR_OFF_COLOR);
        trueIndicator.cylinder.material.color.setHex(TRUE_INDICATOR_OFF_COLOR);
      }
    }
  });

  function rotateIndicator(event) {
    if (indicator_type == "absolute") {
      absoluteRotateIndicator(event);
    } else {
      relativeRotateIndicator(event);
    }
  }

  function relativeRotateIndicator(event) {
    if (IN_TRIAL & rotate_indicator) {
      submit_button.style.visibility = "visible";

      mousePenultimateOrthographicPosition.copy(
        mouseCurrentOrthographicPosition
      );

      // console.log('mouseStartOrthographicPosition 2: ', mouseStartOrthographicPosition)

      setMouseCurrentOrthographicPosition(event);

      distanceCurrentMinusPenultimate.subVectors(
        mouseCurrentOrthographicPosition,
        mousePenultimateOrthographicPosition
      );

      let v0 = new THREE.Vector3(0, 0, radius);

      let radDivSqrt2 = radius / Math.sqrt(2);
      let magnitudeSqrdCurrentMinusPenultimate = Math.pow(
        distanceCurrentMinusPenultimate.length(),
        2
      );

      let v1 = new THREE.Vector3(
        (radDivSqrt2 * distanceCurrentMinusPenultimate.x) /
          magnitudeSqrdCurrentMinusPenultimate,
        (radDivSqrt2 * distanceCurrentMinusPenultimate.y) /
          magnitudeSqrdCurrentMinusPenultimate,
        radDivSqrt2
      );

      let angleArg = v0.dot(v1) / radiusSquared;
      let safeAngleArg = Math.max(Math.min(angleArg, 0.999), -0.999);
      angle = Math.acos(safeAngleArg);
      angle = Math.sign(angle) * 0.1; // replace with safe rate of rotation

      axis.crossVectors(v0, v1).normalize();

      rotationQuaternion.setFromAxisAngle(axis, angle);

      // Check whether rotation would result in line facing backwards.
      // Step 1: Get direction of line.
      let lineDirection = indicator.getDirection();
      // indicator.ring.getWorldDirection(lineDirection);
      // // Step 2: For some reason, line points in opposite direction.
      // // Multiply by -1 to get correct direction.
      // lineDirection.multiplyScalar(-1.)

      // console.log('First line: ', lineDirection)
      // Step 3: Apply quaternion.
      lineDirection.applyQuaternion(rotationQuaternion);
      // console.log('Second line: ', lineDirection)

      let dotWithZDirection = lineDirection.dot(negativeZVector);
      // console.log(dotWithZDirection)
      if (dotWithZDirection < 0.0) {
        indicator.applyQuaternion(rotationQuaternion);

        indicatorDirectionTrajectory.push(indicator.getDirection());
        mousePositionTrajectory.push(mouseCurrentOrthographicPosition);
        indicatorDirectionTimes.push(Date.now());

        //indicator.updateLineColor();
      }

      if (
        _current_trial.trialType === "supervised" ||
        _current_trial.trialType === "reinforcement"
      ) {
        let error = computeGeodesicDistance(
          indicator.getDirection(),
          trueIndicator.getDirection()
        );

        submit_button.disabled = error > errorThreshold;

        $("#percent_correct")[0].value =
          100 - Math.round((100 * error) / Math.PI);
      } else {
        submit_button.disabled = false;
      }
    }
  }

  function absoluteRotateIndicator(event) {
    // console.log(mouseDown);

    if (IN_TRIAL && rotate_indicator) {
      submit_button = $("#submit_button")[0];
      submit_button.style.visibility = "visible";
      setMouseCurrentOrthographicPosition(event);

      let x0 = _current_trial.arrowPosition[0];
      let y0 = _current_trial.arrowPosition[1];

      let x1 = mouseCurrentOrthographicPosition.x;
      let y1 = mouseCurrentOrthographicPosition.y;

      let R = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
      let R1 = Math.min(R, radius - 0.0001);

      let theta = Math.sign(y1 - y0) * Math.acos((x1 - x0) / R);

      let x2 = x0 + R1 * Math.cos(theta);
      let y2 = y0 + R1 * Math.sin(theta);

      let z2 = Math.sqrt(
        Math.pow(radius, 2) - Math.pow(x2 - x0, 2) - Math.pow(y2 - y0, 2)
      );

      let v1 = new THREE.Vector3(x2 - x0, y2 - y0, z2).normalize();

      let v0 = new THREE.Vector3(0, 1, 0);

      let angleArg = v0.dot(v1);
      let safeAngleArg = Math.max(Math.min(angleArg, 0.999), -0.999);
      angle = Math.acos(safeAngleArg);

      axis.crossVectors(v0, v1).normalize();

      indicator.setRotationFromAxisAngle(axis, angle);

      //console.log(v0, v1, axis, angle, indicator.getDirection());

      indicatorDirectionTrajectory.push(indicator.getDirection());
      mousePositionTrajectory.push(mouseCurrentOrthographicPosition);
      indicatorDirectionTimes.push(Date.now());

      if (
        _current_trial.trialType === "supervised" ||
        _current_trial.trialType === "reinforcement"
      ) {
        let error = computeGeodesicDistance(
          indicator.getDirection(),
          trueIndicator.getDirection()
        );

        submit_button.disabled = error > errorThreshold;

        // reinforcementErrorSprite.text = percentCorrect + "%";
        // reinforcementErrorSprite.color = convertPercentCorrectToColorHex(percentCorrect);
        $("#percent_correct")[0].value =
          100 - Math.round((100 * error) / Math.PI);
      } else {
        submit_button.disabled = false;
      }
    }
  }

  document.addEventListener("mousemove", rotateIndicator);

  plugin.trial = function (display_element, trial) {
    // init global timestamps
    indicatorDirection = new THREE.Vector3();
    indicatorPosition = new THREE.Vector3();
    indicatorTrueDirection = new THREE.Vector3();
    indicatorTruePosition = new THREE.Vector3();
    indicatorDirectionTrajectory = new Array();
    indicatorDirectionTimes = new Array();
    mousePositionTrajectory = new Array();

    pointer = new THREE.Vector3();

    distanceCurrentMinusPenultimate = new THREE.Vector3();
    axis = new THREE.Vector3();
    // This vector will be used to check that rotation doesn't permit pointing
    // line in negative Z direction.

    // Wait for a little for data to come back from db, then show_display.
    setTimeout(function () {
      start_trial(trial);
    }, 400);

    function start_trial(trial) {
      IN_TRIAL = true;
      _current_trial = trial;
      rotate_indicator = true;
      var html = "";

      // html += '<div><p>Click the mouse to freeze the arrow</p></div>'
      if (
        trial.trialType === "supervised" ||
        trial.trialType === "reinforcement"
      ) {
        html +=
          '<label for="file">Percent Correct:</label>\n' +
          '<progress id="percent_correct" value="32" max="100"> 0% </progress> ';
      }
      // create threejs_covering_canvas
      html += '<div class="threejs_outer_container">';
      html += '<div class="threejs_inner_container">';
      html +=
        '<img class="threejs_background_image" src="' + trial.imageURL + '">';

      // Get image height and width
      const img = new Image(640, 425);
      img.onload = function () {
        // https://stackoverflow.com/questions/2342132/waiting-for-image-to-load-in-javascript
        imageHeight = img.height;
        imageWidth = img.width;

        html +=
          '<canvas class="threejs_covering_canvas" id="threejs_covering_canvas" height=' +
          imageHeight +
          " width=" +
          imageWidth +
          "></canvas>";
        html += "</div></div>";

        // display button to submit drawing when finished
        html +=
          '<div><img src="/static/images/colormap_white.png" style="float:left; margin: 0px 15px 15px 0px;" width="3%">';
        html +=
          '<button id="submit_button" class="green" style="vertical-align:middle">submit</button></div>';

        // actually assign html to display_element.innerHTML
        display_element.innerHTML = html;

        // warn against refreshing page
        // window.onbeforeunload = function() {
        //   return "Data will be lost if you leave the page. Are you sure you want to leave?";
        // };

        // add event listener to submit button once response window opens
        submit_button = $("#submit_button")[0];
        submit_button.addEventListener("click", end_trial);

        // button is disabled until at least one rotation
        submit_button.style.visibility = "hidden";
        submit_button.disabled = true;

        start_threejs();
        // record trial start timestamp
        startTrialTime = Date.now();

        update_threejs();
        startResponseTime = Date.now();
      };
      img.src = trial.imageURL;
    }

    // triggered either when submit button is clicked or time runs out
    // sends trial data to database
    function start_threejs() {
      canvas = $("#threejs_covering_canvas")[0];

      scene = new THREE.Scene();
      scene.background = null;
      // The canvas will have canvas.width, canvas.height in pixels of order 100
      // Convert to integers e.g. 1000-by-500 image will become -10, 10, 5, -5,
      let cameraRightFulstrum = canvas.width / 100;
      let cameraTopFulstrum = canvas.height / 100;
      camera = new THREE.OrthographicCamera(
        -cameraRightFulstrum,
        cameraRightFulstrum,
        cameraTopFulstrum,
        -cameraTopFulstrum,
        1,
        1000
      );

      // camera.position.z = 5;
      camera.position.set(0, 0, 5);

      // Init the renderer.

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true, // Necessary to make background transparent.
      });
      // Set background to clear color
      renderer.setClearColor(0x000000, 0);

      indicatorPosition = new THREE.Vector3(...trial.arrowPosition);

      if (trial.randomizeArrowInitialDirection) {
        let randomDirection = new THREE.Vector3().random();
        // Ensure random direction is facing forward
        randomDirection.z = Math.abs(randomDirection.z);
        indicatorDirection
          .subVectors(randomDirection, indicatorPosition)
          .normalize();
      } else {
        // Look directly at the camera.
        indicatorDirection
          .subVectors(camera.position, indicatorPosition)
          .normalize();
      }

      // arrow = new THREE.ArrowHelper( arrowDirection, arrowPosition, arrowLength, 0xfffff00, arrowHeadLength, arrowHeadWidth);
      indicator = new KoenderinkCircle(
        indicatorDirection,
        indicatorPosition,
        INDICATOR_ON_COLOR,
        true,
        1.0
      );
      scene.add(indicator);

      // add initial ArrowDirection to trajectory
      indicatorDirectionTrajectory.push(indicator.getDirection());
      indicatorDirectionTimes.push(Date.now());

      if (
        trial.trialType === "supervised" ||
        trial.trialType === "reinforcement"
      ) {
        indicatorTrueDirection = new THREE.Vector3(
          ...trial.trueArrowDirection
        ).normalize();
        indicatorTruePosition.copy(indicatorPosition);
        trueIndicator = new KoenderinkCircle(
          indicatorTrueDirection,
          indicatorTruePosition,
          TRUE_INDICATOR_ON_COLOR,
          false,
          0.4
        );
        scene.add(trueIndicator);

        if (trial.trialType === "reinforcement") {
          trueIndicator.visible = false;
        }
      }
    }

    function update_threejs() {
      // TODO: should these be switched?
      requestAnimationFrame(update_threejs);
      renderer.render(scene, camera);
    }
    // animate();

    function end_trial(e) {
      IN_TRIAL = false;
      if (trial.trialType !== "unsupervised") {
        //console.log("HERE", indicator.getDirection());
        let error = computeGeodesicDistance(
          indicator.getDirection(),
          trueIndicator.getDirection()
        );
        if (error > errorThreshold) {
          return;
        }
      }

      let endTrialTime = Date.now();

      // disable button to prevent double firing
      submit_button.disabled = true;

      // Ensure mouseDown is false.
      rotate_indicator = true;

      // let arrowPixelPosition = arrowPosition;

      // JSON doesn't love Maps, so we need to
      // convert our array of Maps to an array of objects
      // const mapArraytoObjArray = m => {
      //   var objArray = []
      //   for(var i=0; i < m.length; i++) {
      //       objArray.push(Object.fromEntries(m[i]))
      //   }
      //   return objArray
      // };
      // mousePressTimesAndArrowDirections = mapArraytoObjArray(mousePressTimesAndArrowDirections);

      // data saving
      var trial_data = _.extend({}, trial, {
        prolificID: trial.prolificID,
        studyID: trial.studyID,
        sessionID: trial.sessionID,
        dbname: trial.dbname,
        colname: trial.colname,
        iterationname: trial.iterationName,
        startTrialTime: startTrialTime,
        endTrialTime: endTrialTime,
        totalTrialTime: endTrialTime - startTrialTime,
        randomizeArrowInitialDirection: trial.randomizeArrowInitialDirection,
        trialNum: trial.trialNum,
        trialType: trial.trialType,
        image_url_path: trial.url_path,
        indicatorDirectionTrajectory: indicatorDirectionTrajectory,
        indicatorDirectionTimes: indicatorDirectionTimes,
        mousePositionTrajectory: mousePositionTrajectory,
        is_duplicate: trial.is_duplicate,
      });

      // clear the HTML in the display element
      display_element.innerHTML = "";

      // Disable the "Changes you made may not be saved" pop-up window
      window.onbeforeunload = null;

      // end trial
      //console.log("BORK", trial, trial_data);
      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();

function computeGeodesicDistance(participantVec, trueVec) {
  let normalizedParticipantVec = participantVec.normalize();
  let normalizedTrueVec = trueVec.normalize();
  //console.log(participantVec, trueVec, normalizedParticipantVec, normalizedTrueVec);
  // https://www.maths.unsw.edu.au/about/distributing-points-sphere
  let distance = Math.acos(normalizedParticipantVec.dot(normalizedTrueVec));
  return distance;
}

function vecToSurfaceNormalRGB(vec) {
  // normals are in range [-1, 1], so this maps to [0, 1]
  let red = 0.5 * vec.x + 0.5;
  let green = 0.5 * vec.y + 0.5;
  let blue = 0.5 * vec.z + 0.5;

  return new THREE.Color(red, green, blue);
}

class KoenderinkCircle extends THREE.Object3D {
  constructor(dir, origin, on_color, createInnerRing, alphaval) {
    super();
    this.type = "KoenderinkCircle";

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
    var llength = 0.8;
    this._cylinderGeometry = new THREE.CylinderGeometry(
      0.02,
      0.02,
      llength,
      100
    );
    this.cylinder = new THREE.Line(
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

    this._ringGeometry = new THREE.TorusGeometry(0.4, 0.06, 100, 100);
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
          opacity: 0.5,
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
          opacity: 0.5,
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
