var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var prolificID = urlParams.get("PROLIFIC_PID"); // ID unique to the participant
var studyID = urlParams.get("STUDY_ID"); // ID unique to the study
var sessionID = urlParams.get("SESSION_ID"); // ID unique to the particular submission
var projName = urlParams.get("projName");
var expName = urlParams.get("expName");
var iterName = urlParams.get("iterName");
var imagesAsNormals = urlParams.get("imagesAsNormals");
var allSupervised = urlParams.get("allSupervised");
var indicatorType = urlParams.get("indicatorType");
var ignoreInstructions = urlParams.get("ignoreInstructions");
var DEBUG_MODE = urlParams.get("debug") == "true" ? true : false;

var canvas = $("#threejs_covering_canvas")[0];
var renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true, // Necessary to make background transparent.
      });
// Set background to clear color
renderer.setClearColor(0x000000, 0);


var inputID = null; // ID unique to the session served
// var platform = urlParams.get("platform");

if (!(indicatorType)) {
 indicatorType = "relative";
}
/****************************************************
  If you have any other URL Parameters that you need
  for your experiment, read them in them here.
  ie;
  var dominoNumbers = urlParams.get("num_dominos")
*****************************************************/

function logTrialtoDB(data) {
  data.dbname = projName;
  data.colname = expName;
  data.iterationName = iterName;
  data.inputid = inputID;
  data.projName = projName;
  data.expName = expName;
  data.sessionID = sessionID;
  data.studyID = studyID;
  data.userID = prolificID;

  if (DEBUG_MODE) {
    console.log(
      "Logging data to db: " +
        projName +
        "\tcol: " +
        expName +
        "\titeration: " +
        iterName
    );
    console.log("Data: " + data);
  }
  socket.emit("currentData", data);
}

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

  socket.emit("getStims", stimInfo);

  socket.on("stims", (sessionTemplate) => {
    buildAndRunExperiment(sessionTemplate);
  });
}

// Modified by Rylan Schaeffer (2022)
// Originally implemented by Judith E. Fan and Justin Yang (2020)

function buildAndRunExperiment(sessionTemplate) {
  var gameid = sessionTemplate.gameid;
  if (DEBUG_MODE) {
    console.log("Building Experiment with session template: " + sessionTemplate)
  }
  var inputID = sessionTemplate.inputid;

  var timeline = [];

  var experimentTrials = sessionTemplate.data["trials"];
  var familiarizationTrials = sessionTemplate.data["familiarization_trials"];
  var metadata = sessionTemplate.data["metadata"];

  var instructionPages = [
    "<p>Welcome to our experiment! To continue reading the instructions please hit the right arrow key.</p>",
    "<p>Welcome to this experiment. This experiment should take a total of <strong>30 minutes</strong>.</p>" +
    "<p> You will be compensated at a base rate of $15/hour for a total of $7.50, which you will receive as long as you complete the study.</p>",
    "<p>We take your compensation and time seriously! The main experimenter's email for this experiment is <a href='mailto:yyf@mit.edu'>yyf@mit.edu</a>." +
    "<p> Please write this down now, and email us with your Prolific ID and the subject line <i>Human experiment compensation for perception experiment</i> if you have problems submitting this task, or if it takes much more time than expected.</p>",
    "<p>In this study, on every trial, you will be shown a picture of several objects.</p>" +
    "<p>In each picture, there will be an indicator next to or on an object.</p>" +
    "<p><b>Your goal is to point the indicator directly away from the surface of that object.</b></p>",
    "<p>To aim the indicator, click once to unfreeze the indicator and move your mouse around the screen. As you move your mouse, the indicator will rotate.</p>" +
    "<p>When you are satisfied the indicator points away from the surface of the object, click again to freeze the indicator in place and hit SUBMIT.</p><p><strong>You can re-aim the indicator multiple times before submitting</strong></p>", // +
    "<p> <strong>Note: </strong>This experiment works best in full screen, especially on smaller screens.</p>"
    ]
    if (expName.includes("gestalt")) {
        var example_shapes = "https://mlve-v1.s3.us-east-2.amazonaws.com/gestalt_shapegen/examples/shapegen_stims.gif"
        var additional_instruction_page = ["<p>During the experiment, the pictures you will look at will be images of objects camouflaged against the background. The objects in question are complex, un-familiar looking 3D shapes, \n and when they're not camouflaged, look like these shapes: <br><br> \n<img height=450, width=800, src='" + example_shapes + "'></img></p><p><strong>Note: </strong>These are just some of the shapes -- the actual experiment will contain even more of these un-familiar shapes.</p>"]
        instructionPages.push(...additional_instruction_page)
    }

  var trials = [];
  var preload = {
    type: jsPsychPreload,
    auto_preload: true,
    on_start: function () {
      document.body.style.backgroundColor = "#fff";
    },
  };

  var consent = {
    type: jsPsychExternalHtml,
    url: "consent.html",
    cont_btn: "start",
  };

  var instructions = {
    type: jsPsychInstructions,
    pages: instructionPages,
    show_clickable_nav: true,
  };

  trials.push(preload);
  if (!DEBUG_MODE) {
    trials.push(consent);
  }
  if (!(ignoreInstructions)) {
    trials.push(instructions);
  }

  // Create comprehension check survey
  var comprehensionSurvey = {
    type: jsPsychSurveyMultiChoice,
    preamble: "<strong>Comprehension Check</strong>",
    questions: [
      {
        prompt:
          "In each scene, what should your goal be when aiming each indicator?",
        name: "goalOfSurfaceNormal", // "To make a drawing that looks like a generic version of each object, but not any specific example."
        options: [
          "To point the indicator in a random direction",
          "To point the indicator away from the surface of the object",
          "To point the indicator towards the most interesting object",
        ],
        required: true,
      },
      {
        prompt:
          "“Can you re-aim the indicator multiple times before submitting?”\n",
        name: "canUndo",
        options: [
          "Yes, I can re-aim the indicator as many times as I wish.",
          "No, I won't be able to re-aim the indicator after making my choice.",
        ],
        required: true,
      },
    ],
  }; // close comprehensionSurvey

  // Check whether comprehension check is answered correctly
  var checkComprehensionSurvey = {
    timeline: [comprehensionSurvey],
    loop_function: function (data) {
      resp = data.values()[0]["response"];
      if (
        resp["goalOfSurfaceNormal"] ===
          "To point the indicator away from the surface of the object" &&
        // && resp['instanceLevelPhoto'] == "Yes. I should make my drawing identifiable at the level of a specific image."
        resp["canUndo"] ===
          "Yes, I can re-aim the indicator as many times as I wish."
      ) {
        return false;
      } else {
        alert("Try again! One or more of your responses was incorrect.");
        return true;
      }
    }, // close loop_function
  }; // close loopNode

  if (!(ignoreInstructions)) {
    // trials.push(comprehensionSurvey);
    trials.push(checkComprehensionSurvey);
  }

  // Create consent + instructions trial
  var supervisedTrialInstructions = {
    type: jsPsychInstructions,
    pages: [
      "Well done! We'll start with " +
        3 +
        " guided trials.<br><br>In these trials, we've added a <strong style='color:blue'>BLUE INDICATOR</strong> that points in the correct direction. Move your mouse so that the <strong style='color: red'> RED INDICATOR</strong>  points in the same direction.<br><br>Once your red indicator points in the correct direction, click the mouse to lock your answer in and hit the submit button. For these first trials, you won't be able to hit the submit button until your red indicator points in the correct direction.",
        "Move your mouse so that the <strong style='color:red'>RED INDICATOR</strong> points in the same direction as the correct <strong style='color:blue'>BLUE INDICATOR</strong>.",
    ],
    //force_wait: 1500,
    show_clickable_nav: true,
    allow_keys: true,
    allow_backward: true,
  }


  trials.push(supervisedTrialInstructions)
  /***************** Familiarization Trials *********************/

  for (var i = 0; i < familiarizationTrials.length; i++) {
    var trialData = familiarizationTrials[i];
    if (DEBUG_MODE) {
      console.log(trialData);
    }
    if (i == 3) {
      var reinforcementTrialInstructions = {
        type: jsPsychInstructions,
        pages: [
          "Good! We'll next try several practice trials.<br><br><b>Find the indicator and aim it away from the object.</b><br><br>We'll help you by telling you how close you are to the correct answer.<br><br>",
        ],
        show_clickable_nav: true,
        allow_keys: true,
        allow_backward: true,
      };

      trials.push(reinforcementTrialInstructions);
    }

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

  trials.push({
    type: jsPsychInstructions,
    pages: [
      "Okay! We are now ready to begin the real trials.<br><br>Sometimes the indicator can be hard to see. You may need to try moving the indicator to see it.<br><br>" +
      // "In the real experiment, you will also need to report <strong>how confident you are in your answers</strong>. There will be a slider before the continue button." +
      // " Before clicking submit please use that slider to report (on a scale of 1-10) how confident you are in your judgement.<br><br>" +
      "Click 'Start' to begin the experiment.",
    ],
    allow_backward: false,
    show_clickable_nav: true,
    button_label_next: "Start",
  });

  /******************* Construct Experiment Trials ************************/
  experimentTrials = shuffle(experimentTrials);

  for (var index = 0; index < experimentTrials.length; index++) {
    if (index == Math.floor(experimentTrials.length / 2)) {
      var progressTrial = {
        type: jsPsychInstructions,
        pages: ["<p>You're halfway through the experiment! Great job so far! Give your eyes a moment to rest, and enjoy this picture of a Japanese Macaque resting in a hot spring while you do.</p> <img src='https://mlve-v1.s3.us-east-2.amazonaws.com/attention_checks/misc/jm_3.jpg' height=683, width=1024></img>"],
        show_clickable_nav: true,
        button_label_next: "Continue",
        allow_backward: false,
      };
      trials.push(progressTrial);
    }

    var trialData = experimentTrials[index];
    if (DEBUG_MODE) {
      console.log(trialData);
    }
    var onFinish = function (responseData) {
      trial_index = responseData["index"];

      var trial_data = [experimentTrials[trial_index], responseData].reduce(
        function (r, o) {
          Object.keys(o).forEach(function (k) {
            r[k] = o[k];
          });
          return r;
        },
        {}
      );
      trial_data["gameid"] = gameid;

      if (DEBUG_MODE) {
        console.log(trial_data);
      }
      logTrialtoDB(trial_data);
    };

    var imageURL = imagesAsNormals ? trialData["normalImageURL"] : trialData["imageURL"];
    var trialType = allSupervised ? "supervised" : trialData["trialType"];
    var trial = {
      type: surfaceNormalsTask,
      imageURL: imageURL,
      trialType: trialType,
      arrowPosition: trialData["arrowPosition"],
      randomizeArrowInitialDirection: trialData["randomizeArrowInitialDirection"],
      trueArrowDirection: trialData["trueArrowDirection"],
      index: index,
      indicatorType: indicatorType,
      on_finish: onFinish,
    }

    trials.push(trial);
  }

    // Create goodbye trial (this doesn't close the browser yet)
    // TODO: Add prolific return link e.g. https://github.com/cogtoolslab/physics-benchmarking-neurips2021/blob/master/experiments/rollingsliding_pilot/js/setup.js#L402
    var goodbye = {
      type: jsPsychInstructions,
      pages: [
        "Thanks for participating in our experiment! You are all done. Please click the 'Next' button to submit this study. Your completion code for this study is: C1041ND4. <br> \
      If you have any questions, feel free to email us at <a href='mailto:yyf@mit.edu'>yyf@mit.edu</a>.",
      ],
      show_clickable_nav: true,
      allow_backward: false,
      on_finish: () => {
        // do something to give credit to participants
        //completion_url = "https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=1989&credit_token=c41f43c84bd44f4f8412479930659e9c&survey_code=" + SONA_ID
        // window.open("https://app.prolific.co/submissions/complete?cc=1BD370CB", "_self")
      },
    }; // close goodbye


    // Add survey page after trials are done
    var exitSurveyText = {
      type: jsPsychSurveyText,
      preamble: "<strong><u>Exit Survey</u></strong>",
      on_finish: function (comments) {
      logTrialtoDB(comments);
        document.body.innerHTML = `<p> Please wait. You will be redirected back to Prolific in a few moments.
          </p> If not, please use the following completion code to ensure \
          compensation for this study: C1041ND4`;
        setTimeout(function () {
        location.href =
          "https://app.prolific.co/submissions/complete?cc=C1041ND4";
        }, 500);
      },
      questions: [
        {
          name: "TechnicalDifficultiesFreeResp",
          prompt:
            "If you encountered any technical difficulties, please briefly describe the issue.",
          placeholder: "I did not encounter any technical difficulities.",
          rows: 5,
          columns: 50,
          required: false,
        },
        {
          name: "participantComments",
          prompt:
            "Thank you for participating in our study! Do you have any other comments or feedback to share with us about your experience?",
          placeholder: "I had a lot of fun!",
          rows: 5,
          columns: 50,
          required: false,
        },
      ],
    }; // close exitSurveyText

    trials.push(exitSurveyText);
    trials.push(goodbye);

    // // add experiment elements to trials array
    // var experiment = [];
    // if (forceFullscreen) experiment.push(enterFullscreen);
    // if (includeIntro) experiment.push(welcome);
    // if (includeQuiz) experiment.push(checkComprehensionSurvey);
    // if (includeSupervisedTrials) {
    //   experiment.push(supervisedTrialInstructions);
    //   // concat is JS's version of Python's extend
    //   experiment.push(...sessionTrials.slice(0, numSupervisedTrials));
    // }
    // if (includeReinforcementTrials) {
    //   experiment.push(reinforcementTrialInstructions);
    //   // concat is JS's version of Python's extend
    //   experiment.push(
    //     ...sessionTrials.slice(
    //       numSupervisedTrials,
    //       numSupervisedTrials + numReinforcementTrials
    //     )
    //   );
    // }
    // experiment.push(unsupervisedTrialInstructions);
    // // concat is JS's version of Python's extend
    // experiment.push(
    //   ...sessionTrials.slice(numReinforcementTrials + numSupervisedTrials)
    // );

    // var experiment = setup.concat(trials);

    // // if (includeExitSurvey) experiment.push(exitSurveyChoice);
    // if (includeExitSurvey) experiment.push(exitSurveyText);
    // if (includeGoodbye) experiment.push(goodbye);
    // if (forceFullscreen) experiment.push(exitFullscreen);


  function duplicateAndPushArrElements(arr, startIdx, numDuplicates) {
    // https://stackoverflow.com/a/19631135/4570472
    // Arbitrarily take the first numDuplicate trials, since random
    // sampling was already done by server
    var duplicates = arr.slice(startIdx, startIdx + numDuplicates);
    console.log("numDupe", numDuplicates);
    for (let i = 0; i < numDuplicates; i++) {
      // Ensure we create a duplicate.
      duplicates[i] = Object.assign({}, duplicates[i]);
      duplicates[i].is_duplicate = true;
    }
    arr.push(...duplicates);

    return arr;
  }

  console.log("Experiment trials: ");
  console.log(trials);

  // create jspsych timeline object
  var jsPsych = initJsPsych({
    timeline: trials,
    default_iti: 1000,
    show_progress_bar: true,
  });

  jsPsych.run(trials);

}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
