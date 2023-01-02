var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var prolificID = urlParams.get("PROLIFIC_PID"); // ID unique to the participant
var studyID = urlParams.get("STUDY_ID"); // ID unique to the study
var sessionID = urlParams.get("SESSION_ID"); // ID unique to the particular submission
var projName = urlParams.get("projName");
var expName = urlParams.get("expName");
var iterName = urlParams.get("iterName");
var batchId = urlParams.get("batchId")
var DEBUG_MODE = urlParams.get("debug") == "true" ? true : false;
var viewing_time = parseInt(urlParams.get("viewing_time")) || -1;
var probe_color = urlParams.get("probe_color") || "red";
var probe_size = parseInt(urlParams.get("probe_size")) || 10;
var probe_shape = urlParams.get("probe_shape") || "circle";
var virtual_chinrest = urlParams.get("virtual_chinrest") || "false";

var inputID = null; // ID unique to the session served
// var platform = urlParams.get("platform");

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
    batch_id: batchId,
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
    if (DEBUG_MODE) {
      console.log(sessionTemplate);
    }
    buildAndRunExperiment(sessionTemplate);
  });
}

function buildAndRunExperiment(sessionTemplate) {
  /*
  This function should be modified to fit your specific experiment needs.
  The code you see here is an example for one kind of experiment.

  The function receives stimuli / experiment configs from your database,
  and should build the appropriate jsPsych timeline. For each trial, make
  sure to specify an onFinish function that saves the trial response.
    --> see `stim_on_finish` function for an example.
*/
  if (DEBUG_MODE) {
    console.log("building experiment with config: ", sessionTemplate);
  }
  var gameid = sessionTemplate.gameid;
  var inputID = sessionTemplate.inputid;

  var trials = [];

  var experimentTrials = sessionTemplate.data["trials"];
  var familiarizationTrials = sessionTemplate.data["familiarization_trials"];
  var metadata = sessionTemplate.data["metadata"];

  var instruction_pages = [
    "<p>Welcome to our experiment! To continue reading the instructions please hit the right arrow key.</p>",
    "<p>Welcome to this experiment. This experiment should take a total of <strong>15 minutes</strong>. </br></br> You will be compensated at a base rate of $15/hour for a total of $3.75, which you will receive as long as you complete the study.</p>",
    "<p>We take your compensation and time seriously! The main experimenter's email for this experiment is <a href='mailto:yyf@mit.edu'>yyf@mit.edu</a>. </br></br> Please write this down now, and email us with the subject line <i>Human experiment compensation for segmentation estimation experiment</i> if you have problems submitting this task, or if it takes much more time than expected.</p>",
      "<p>This experiment will work as follows: an image will briefly flash on your screen, with two yellow stars drawn on that image. You need to determine <strong>if the two stars are on the same object?</strong></p><p>Before each trial, there will be a fixation cross in the middle of the screen.</p>" + 
      "<p>When you are ready to start the trial you'll press the space bar. Make sure you keep your eyes on the fixation cross for the duration of the trial.</p>",
      "<p>Because the image will only be presented on the screen for a fraction of a second, you might not feel confident you know the correct answer. That's ok! If you're not positive whether the two yellow stars were on the same object or different objects, just go with your best bet.</p>",
  ]
    if (expName.includes("gestalt")) {
    var example_shapes = "https://mlve-v1.s3.us-east-2.amazonaws.com/gestalt_shapegen/examples/shapegen_stims.gif"
        var additional_instruction_page = ["<p>During the experiment, the pictures you will look at will be images of objects camouflaged against the background. The objects in question are complex, un-familiar looking 3D shapes, \n and when they're not camouflaged, look like these shapes: <br><br> \n<img height=450, width=800, src='" + example_shapes + "'></img></p><p><strong>Note: </strong>These are just some of the shapes -- the actual experiment will contain even more of these un-familiar shapes.</p>"]
        instruction_pages.push(...additional_instruction_page)
    }
    
    browser_check = {
      type: jsPsychBrowserCheck,
      on_finish: function (trial_data) {
        trial_data["gameid"] = gameid;
        trial_data["userID"] = prolificID;
        trial_data["batchID"] = batchId;
        trial_data["expName"] = expName;
        trial_data["iterName"] = iterName;
        trial_data["projName"] = projName;
        trial_data["inputID"] = inputID;
        trial_data["trial_type"] = "virtual_chinrest";
  
        if (DEBUG_MODE) {
          console.log(trial_data);
        }
        logTrialtoDB(trial_data);
      }
    };
    trials.push(browser_check)
    if (virtual_chinrest) {
        var additional_instruction_page = ["<p>Because this experiment is studying visual perception, it's helpful for us to get a sense of how far away you are sitting from the computer.</p>" + 
      "<p>That information allows us to calculate a rough estimate of how much of the image you should be able to see clearly on the screen.</p>",
      "<p>On the next page, you will go through two exercises to help us estimate how far away you are sitting from the computer.</p>"]
        instruction_pages.push(...additional_instruction_page)
        var instructions = {
          type: jsPsychInstructions,
          pages: instruction_pages,
          show_clickable_nav: true,
        };
        trials.push(instructions);
        virtual_chinrest = {
            type: jsPsychVirtualChinrest,
            blindspot_reps: 3,
            resize_units: "none",
            on_finish: function (trial_data) {
                trial_data["gameid"] = gameid;
                trial_data["userID"] = prolificID;
                trial_data["batchID"] = batchId;
                trial_data["expName"] = expName;
                trial_data["iterName"] = iterName;
                trial_data["projName"] = projName;
                trial_data["inputID"] = inputID;
                trial_data["trial_type"] = "virtual_chinrest";
          
                if (DEBUG_MODE) {
                  console.log(trial_data);
                }
                logTrialtoDB(trial_data);
            }
        };
        trials.push(virtual_chinrest);
        instruction_pages = ["<p>Great! Thank you for your help.</p>"];
    }

    instruction_pages.push(...[
        "<p>There will be some practice trials on the next page to get you familiar with the experiment setup (you will receive feedback if you select the incorrect answer), and then the real experiment will begin. Good luck!</p>"
  ]);

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
    pages: instruction_pages,
    show_clickable_nav: true,
  };

  trials.push(preload);
  if (!DEBUG_MODE) {
    trials.push(consent);
  }
  trials.push(instructions);

  var fixation = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: function(c) {
      // Draw a small 40x40 fixation cross
      ctx = c.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "black";
      ctx.fillRect(c.width / 2 - 1, c.height / 2 - 20, 2, 40);
      ctx.fillRect(c.width / 2 - 20, c.height / 2 - 1, 40, 2);
    },
    canvas_size: [512, 512],
    choices: [' '],
    prompt: "<p>Press the spacebar to continue.</p>",
  };

  /******************** Familiarization Trials **********************/
  for (var i = 0; i < familiarizationTrials.length; i++) {
    var trialData = familiarizationTrials[i];
    console.log("correct choice:" + trialData.correct_segmentation, trialData)

    var trial = {
      type: segmentationTrial,
      stimulus: trialData.imageURL,
      choices: ["No", "Yes"],
      correct_segmentation: trialData.correct_segmentation,
      correct_depth: trialData.correct_depth,
      probe_locations: trialData.probeLocations,
      viewing_time: trialData.viewing_time,
      probe_color: probe_color,
      probe_size: probe_size,
      probe_shape: probe_shape,
      practice_trial: true,
      debug: DEBUG_MODE,
    };

    trials.push(fixation);
    trials.push(trial);
  }

  /****************** Pre-Experiment Warning ***************************/
  trials.push({
    type: jsPsychInstructions,
    pages: [
      "Great job! The experiment will begin on the next page. From here on out, you won't receive any feedback on  which is the correct. \
      Click 'Start' to begin the experiment.",
    ],
    allow_backward: false,
    show_clickable_nav: true,
    button_label_next: "Start",
  });

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

  /******************* Construct Actual Experiments ************************/
  experimentTrials = shuffle(experimentTrials);
  for (var index = 0; index < experimentTrials.length; index++) {
    if (index == Math.floor(experimentTrials.length / 2)) {
      var progressTrial = {
        type: jsPsychInstructions,
        pages: ["<p>You're halfway through the experiment! Great job so far! Give your eyes a moment to rest, and enjoy this picture of some Japanese Macaques resting in a hot spring while you do.</p> <img src='https://mlve-v1.s3.us-east-2.amazonaws.com/attention_checks/misc/jm_3.jpg' height=683, width=1024></img>"],
        show_clickable_nav: true,
        button_label_next: "Continue",
        allow_backward: false,
      };
      trials.push(progressTrial);
    }

    var trialData = experimentTrials[index];

    var onFinish = function (responseData) {
      trial_index = responseData["index"];
      if (DEBUG_MODE) {
        console.log(trial_index);
      }
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

    var trial = {
      type: segmentationTrial,
      index: index,
      stimulus: trialData.imageURL,
      choices: ["No", "Yes"],
      correct_segmentation: trialData.correct_segmentation,
      correct_depth: trialData.correct_depth,
      probe_locations: trialData.probeLocations,
      viewing_time: viewing_time,
      practice_trial: false,
      probe_color: probe_color,
      probe_size: probe_size,
      probe_shape: probe_shape,
      debug: DEBUG_MODE,
      on_finish: onFinish,
    };

    trials.push(fixation);
    trials.push(trial);
  }

  var commentsBlock = {
    type: jsPsychSurveyText,
    preamble: `<p>Thank you for participating in our study.</p><p><strong>Click "Finish" to complete the experiment and
      receive compensation.</strong> If you have any comments, please let us know in the form below.</p>`,
    questions: [{ prompt: "Do you have any comments to share with us?" }],
    button_label: "Finish",
    on_finish: function (comments) {
      logTrialtoDB(comments);
      document.body.innerHTML = `<p> Please wait. You will be redirected back to Prolific in a few moments.
        </p> If not, please use the following completion code to ensure \
        compensation for this study: B4A98EE7`;
      setTimeout(function () {
        location.href =
          "https://app.prolific.co/submissions/complete?cc=B4A98EE7";
      }, 500);
    },
  };
  trials.push(commentsBlock);

  if (DEBUG_MODE) {
    console.log(trials);
  }

  var jsPsych = initJsPsych({
    timeline: trials,
    default_iti: 1000,
    show_progress_bar: true,
  });

  jsPsych.run(trials);
}
