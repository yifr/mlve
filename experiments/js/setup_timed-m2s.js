var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var prolificID = urlParams.get("PROLIFIC_PID"); // ID unique to the participant
var studyID = urlParams.get("STUDY_ID"); // ID unique to the study
var sessionID = urlParams.get("SESSION_ID"); // ID unique to the particular submission
var projName = urlParams.get("projName");
var expName = urlParams.get("expName");
var iterName = urlParams.get("iterName");
var stimulus_duration = urlParams.get("stimDuration");
var choice_duration = urlParams.get("choiceDuration");
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
    "<p>In this experiment, you will be asked to match an object to a picture of the same object from a different view.\n A picture of an object will appear at the top of the screen. There will be two outlined options underneath - all you need to do is simply click on the outlined object that is the same as the one on top! You will do several practice trials before starting the experiment.</p>",
    "<p>Go with your initial instinct and try not to spend more than a few seconds on each trial. Sometimes, the options you need to choose between might look very similar (even indistinguishable). Don't get frustrated - that's just part of the experiment! You should expect that some of these trials <i>might</i> be too difficult to solve. Again, don't take more than a few seconds, go with your best guess, and move on to the next trial.</p>",
  ]

  example_page = "<p>These animations show the range of possible viewpoints you will see for the different objects in this experiment:</p><p>"
  for (var i=0; i < 24; i ++) {
    example_page += "<img src='https://thomas-m2s.s3.amazonaws.com/misc/example_" + i + ".gif' />"
    if ((i + 1) % 4 == 0) {
      example_page += "</p><p>"
    }
  }
  example_page += "</p>"
  instruction_pages.push(example_page)

  instruction_pages.push("<p>Ready? Once you continue there will be 12 practice trials, and then the experiment will begin.</p><p>You won't be able to review any of the instructions after this page, so to review any of the instructions now just hit the back arrow to return to a previous page.</p>")


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
    var gt_first = Math.random() > 0.5;
    var choices = gt_first
      ? [trialData.img_target, trialData.img_lure]
      : [trialData.img_lure, trialData.img_target];
    var trial = {
      type: m2sTrial,
      stimulus: trialData.img_sample,
      choices: choices,
      correct_choice: gt_first ? 0 : 1,
      stimulus_duration: stimulus_duration,
      choice_duration: choice_duration,
      button_html: "<img style='border: 1px black solid' height='400px' width='400px' src=%choice%></img>",
      practice_trial: true,
      debug: DEBUG_MODE,
    };

    trials.push(trial);
  }

  /****************** Pre-Experiment Warning ***************************/
  trials.push({
    type: jsPsychInstructions,
    pages: [
      "Great job! The experiment will begin on the next page. From here on out, you won't receive any feedback on  which is the correct shape. The trials will also be more difficult, so get ready! \
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
        pages: ["You're halfway through the experiment! Great job so far!"],
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

    var gt_first = Math.random() > 0.5;
    choices = gt_first
      ? [trialData.img_target, trialData.img_lure]
      : [trialData.img_lure, trialData.img_target];

    var trial = {
      type: m2sTrial,
      index: index,
      stimulus: trialData.img_sample,
      choices: choices,
      correct_choice: gt_first ? 0 : 1,
      //probe_location: trialData.probe_location,
      button_html: "<img style='border: 1px black solid' height='400px' width='400px' src=%choice%></img>",
      practice_trial: false,
      debug: DEBUG_MODE,
      on_finish: onFinish,
    };
      if (DEBUG_MODE) {
          console.log(trial)
      }
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
