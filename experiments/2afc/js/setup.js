var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var prolificID = urlParams.get("PROLIFIC_PID"); // ID unique to the participant
var studyID = urlParams.get("STUDY_ID"); // ID unique to the study
var sessionID = urlParams.get("SESSION_ID"); // ID unique to the particular submission
var projName = urlParams.get("projName");
var expName = urlParams.get("expName");
var iterName = urlParams.get("iterName");
var DEBUG_MODE = urlParams.get("debug") == "true" ? true : false;
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

  var timeline = [];

  var experimentTrials = sessionTemplate.data["trials"];
  var familiarizationTrials = sessionTemplate.data["familiarization_trials"];
  var metadata = sessionTemplate.data["metadata"];

  var instruction_pages = [
    "<p>Welcome to our experiment! To continue reading the instructions please hit the right arrow key.</p>",
    "<p>Welcome to this experiment. This experiment should take a total of <strong>15 minutes</strong>. </br></br> You will be compensated at a base rate of $15/hour for a total of $3.75, which you will receive as long as you complete the study.</p>",
    "<p>We take your compensation and time seriously! The main experimenter's email for this experiment is <a href='mailto:yyf@mit.edu'>yyf@mit.edu</a>. </br></br> Please write this down now, and email us with your Prolific ID and the subject line <i>Human experiment compensation for match-to-sample experiment</i> if you have problems submitting this task, or if it takes much more time than expected.</p>",
    "<p>In this experiment, you will be asked to determine the shape of an object, indicated by a red dot.\nDuring the experiment, objects will be camouflaged against the background. The objects in question are simple, 3D shapes, \n and when they're not camouflaged, look like these shapes: <br><br> \n<img height=450, width=800, src='https://gestalt-scenes.s3.us-east-2.amazonaws.com/experiment_media/static_detection/all_stims.gif'></img></p>",
    "<p>Objects can appear anywhere in a scene. At the start of a trial, the red dot will flash over the object you need to identify. There will be two options underneath - all you need to do is simply click the correct shape below! You can see an example trial here: <br><img src='https://gestalt-scenes.s3.us-east-2.amazonaws.com/experiment_media/m2s/m2s_example.gif' width=512, height=512></p>",
    "<p>Sometimes, the options you need to choose between might look very similar (even indistinguishable). Don't get frustrated - that's just part of the experiment! You should expect that some of these trials <i>might</i> be too difficult to solve, so if you're having a hard time figuring out the correct answer just go with your best guess and move on to the next trial.</p>",
    "<p>If you guess randomly on every trial you should expect to get a score of 50%. We have some checks in place to detect random guessing - low effort responses will be removed and won't be compensated. Bonuses will be given out to participants who score high enough above random chance.</p>",
    "<p>Ready? Once you continue there will be six practice trials, and then the experiment will begin.</p><p>You won't be able to review any of the instructions after this page, so to review any of the instructions now just hit the back arrow to return to a previous page.</p>",
  ];

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
    pages: instruction_pages,
    show_clickable_nav: true,
  };

  trials.push(preload);
  if (!DEBUG_MODE) {
    trials.push(consent);
  }
  trials.push(instructions);

  /******************** Familiarization Trials **********************/
  for (var i = 0; i < familiarizationTrials.length; i++) {
    var trialData = familiarizationTrials[i];
    var gt_first = Math.random() > 0.5
    var choices = gt_first ? [trialData.gt_shape_url, trialData.alt_shape_url] :
                                    [trialData.alt_shape_url, trialData.gt_shape_url]
    var trial = {
      type: jsPsych2afcResponse,
      stimulus: trialData.image_url,
      choices: choices,
      correct_choice: gt_first? 0 : 1,
      probe_location: trialData.probe_location,
      button_html: "<img height='128px' src=%choice%></img>",
      practice_trial: true,
      debug: DEBUG_MODE,
    };

    trials.push(trial);
  }

  /****************** Pre-Experiment Warning ***************************/
  trials.push({
    type: jsPsychInstructions,
    pages: [
      "Great job! The experiment will begin on the next page. From here on out, you won't receive any feedback on the ground truth bounding boxes. \
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

  for (var i = 0; i < experimentTrials.length; i++) {
    if (i == Math.floor(experimentTrials.length / 2)) {
      var progressTrial = {
        type: jsPsychInstructions,
        pages: ["You're halfway through the experiment! Great job so far!"],
        show_clickable_nav: true,
        button_label_next: "Continue",
        allow_backward: false,
      };
      trials.push(progressTrial);
    }

    var trialData = experimentTrials[i];

    var onFinish = function (responseData) {
      var trial_data = [trialData, responseData].reduce(function (r, o) {
        Object.keys(o).forEach(function (k) {
          r[k] = o[k];
        });
        return r;
      }, {});
      trial_data["gameid"] = gameid;

      if (DEBUG_MODE) {
        console.log(trial_data);
      }
      logTrialtoDB(trial_data);
    };

    var gt_first = Math.random() > 0.5
    choices = gt_first ? [trialData.gt_shape_url, trialData.alt_shape_url] :
                                    [trialData.alt_shape_url, trialData.gt_shape_url]

    var trial = {
      type: jsPsych2afcResponse,
      stimulus: trialData.image_url,
      choices: choices,
      correct_choice: gt_first? 0 : 1,
      probe_location: trialData.probe_location,
      button_html: "<img height='128px' src=%choice%></img>",
      practice_trial: false,
      debug: DEBUG_MODE,
      on_finish: onFinish,
    };

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
      document.body.innerHTML =
        `<p> Please wait. You will be redirected back to Prolific in a few moments.
        </p> If not, please use the following completion code to ensure \
        compensation for this study: B4A98EE7`;
      setTimeout(function () {
        location.href =
          "https://app.prolific.co/submissions/complete?cc=B4A98EE7"
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
