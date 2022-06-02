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

// Modified by Rylan Schaeffer (2022)
// Originally implemented by Judith E. Fan and Justin Yang (2020)

function buildAndRunExperiment() {
  var dbname = "human_physics_benchmarking";
  var colname = "surface_normals";
  var iterationName = "20220316";

  // get experiment ID information from URL
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);

  // collect necessary data from Prolific
  var prolificID = urlParams.get("PROLIFIC_PID"); // ID unique to the participant
  var studyID = urlParams.get("STUDY_ID"); // ID unique to the study
  var sessionID = urlParams.get("SESSION_ID"); // ID unique to the particular submission

  const numTrialsInSession = 90;
  const numDuplicateTrialsInSession = 20;

  var realTrials;
  function getSessionTrials(
    requestedNumTrials,
    dbName,
    colname,
    iterationName,
    prolificID,
    studyID,
    sessionID
  ) {
    var xhr = new XMLHttpRequest();
    // false denotes the request should not be handled asynchronously.
    xhr.open("POST", "/get_session_data", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onload = function () {
      if (xhr.status == 200) {
        session_data = JSON.parse(xhr.responseText);
        realTrials = session_data["trials"];
        indicator_type = session_data["indicator_type"];
      }
    };
    // Need to stringify, otherwise result is Object
    // Send number of requested trials.
  
  var sessionTrials = tutorialTrials.concat(realTrials);

  // At end of each trial, send trial data to server.
  var trialOnFinish = function (trialData) {
    postTrialDataOnceFinished(trialData);
  };

  // SONA-assigned anonymous ID.
  // Note: needs study to be entered in the form https://cogtoolslab.org:XXXX/index.html?id=%SURVEY_CODE%
  // var SONA_ID = urlParams.get('id')

  // Flag for controlling experiment
  const forceFullscreen = false;
  const includeIntro = true;
  const includeQuiz = true;
  const includeSupervisedTrials = true;
  const numSupervisedTrials = 3;
  const includeReinforcementTrials = true;
  const numReinforcementTrials = 3;
  const includeExitSurvey = true;
  const includeGoodbye = true;
  const randomizeImageOrder = true;
  const randomizeArrowInitialDirection = true;
  const useCueDuration = false;

  if (numReinforcementTrials + numReinforcementTrials > 8) {
    throw "We need more labeled data!";
  }

  var additionalInfo = {
    prolificID: prolificID,
    studyID: studyID,
    sessionID: sessionID,
    on_finish: trialOnFinish,
  };

  for (let i = 0; i < sessionTrials.length; i++) {
    if (includeSupervisedTrials && i < numSupervisedTrials) {
      sessionTrials[i].trialType = "supervised";
    } else if (
      includeReinforcementTrials &&
      i < numSupervisedTrials + numReinforcementTrials
    ) {
      sessionTrials[i].trialType = "reinforcement";
    } else {
      sessionTrials[i].trialType = "unsupervised";
    }
    sessionTrials[i].type = "jspsych-surface-normals"; // type determines what plugin to use for each trial
    sessionTrials[i].randomizeArrowInitialDirection =
      randomizeArrowInitialDirection;
    sessionTrials[i].useCueDuration = useCueDuration;
    sessionTrials[i].prolificID = prolificID;
    sessionTrials[i].studyID = studyID;
    sessionTrials[i].sessionID = sessionID;
    sessionTrials[i].on_finish = trialOnFinish;
    sessionTrials[i].dbname = dbname;
    sessionTrials[i].colname = colname; // collection name, not column name
    sessionTrials[i].iterationName = iterationName;
    sessionTrials[i].imageURL = sessionTrials[i].url_path;
    sessionTrials[i].arrowPosition = sessionTrials[i].position;
    sessionTrials[i].is_duplicate = sessionTrials[i].is_duplicate;
  }

  sessionTrials = duplicateAndPushArrElements(
    sessionTrials,
    numSupervisedTrials + numReinforcementTrials,
    numDuplicateTrialsInSession
  );

  if (randomizeImageOrder) {
    // Don't shuffle the supervised or reinforcement trials
    sessionTrials = shuffleSubArrayInPlace(
      sessionTrials,
      numSupervisedTrials + numReinforcementTrials
    );

    // Renumber the trials after shuffling.
    for (let i = 0; i < sessionTrials.length; i++) {
      sessionTrials[i].trialNum = i;
    }
  }

  // Define consent form language
  let consentHTML = {
    str1: "<p> Hello! We are a group of researchers at Stanford interested in studying how people\
     perceive physical properties of the world.</p><p>In this study, you will help us study how people understand\
     the shapes of objects by pointing some indicators! </p><p> We expect the average experiment to last about 20 minutes, including the time \
         it takes to read these instructions. For your participation in this study, you will be paid $3.33.</p>",
    str2: [
      "<u><p id='legal'>Consenting to Participate:</p></u>",
      "<p id='legal'>By completing this session, you are participating in a study being performed by cognitive scientists\
       at Stanford. If you have questions about this research, please contact\
      <b>Dan Yamins</b> at <b><a href='mailto:yamins@stanford.edu?subject=Surface Normals Experiment'>yamins@stanford.edu</a></b>. You must be at least 18 years old to participate.\
      There are neither specific benefits nor anticipated risks associated with participation in this study. Your participation in this research is voluntary. You may decline to answer any \
      or all of the following questions. You may decline further participation, at any time, without adverse consequences. Your anonymity is assured; the researchers who have requested your\
       participation will not reveal any personal information about you.</p>",
    ].join(" "),
  };
  // Define instructions language
  let instructionsHTML = {
    str1:
      "<p>In this study, on every trial, you will be shown a picture of several objects.</p>" +
      "<p>In each picture, there will be an indicator next to or on an object.</p>" +
      "<p><b>Your goal is to point the indicator away from the surface of that object.</b></p>",
    str2:
      "<p>To aim the indicator, click and drag your mouse. As you drag your mouse, the indicator will rotate.</p>" +
      "<p>When you are satisfied the indicator points away from the surface of the object, click SUBMIT.", // +
    // "<p><video width=\"45%\" height=\"45%\" controls>\n" +
    // "  <source src=\"stimuli/demo.webm\" type=\"video/webm\">" +
    // "  <source src=\"stimuli/demo.mp4\" type=\"video/mp4\">\n" +
    // "</video></p>",
    // 'str3': '<p>Finally, please maximize this window to best see the scenes.</p><p>Let\'s begin!</p>'
  };
  // instructionsHTML = {
  //   'str1': "<p>In this study, you will be making drawings of various objects, given gan image. Your goal is to make drawings that look like the <b>specific</b> object that you were shown.</p>\
  //               <p>For example, suppose we asked you to draw a face. Instead of drawing a generic smiley face, you will be shown a <b>specific person's face</b> to make a drawing of. Importantly, someone should be able to guess which person's face you were shown, a lineup of different faces. \
  //                You do not, however, need to be concerned about making them look pretty.</p>\
  //               <img height = '300' src = 'stimuli/instances_only.png'>",
  //   'str2': "<p>On every trial, you will be shown an image (e.g., of a face) for 8 seconds. After the 8 seconds is up, you will produce a drawing of that <b>specific</b> image you were just shown:</p>\
  //               <img height = '300' src = 'stimuli/instance_photo_screencap.gif'>\
  //               <p>Although you will have as much time as you need to make your drawing, you won't be able to erase or 'undo' any part of your drawing while you are making it. \
  //               So please do your best to think about how you want your drawing to look before you begin each one. When you are satisfied with the drawing, please click SUBMIT.</p>",
  //   'str3': '<p>Finally, please adjust your screen such that the drawing space is not blocked in any way. <br> Let\'s begin!</p>'
  // }

  // force fullscreen
  var enterFullscreen = {
    type: "fullscreen",
    fullscreen_mode: true,
  };

  var exitFullscreen = {
    type: "fullscreen",
    fullscreen_mode: false,
    delay_after: 0,
  };

  // Create consent + instructions trial
  var welcome = {
    type: "instructions",
    pages: [
      consentHTML.str1,
      consentHTML.str2,
      instructionsHTML.str1,
      instructionsHTML.str2,
      // instructionsHTML.str3,
    ],
    //force_wait: 1500,
    show_clickable_nav: true,
    allow_keys: false,
    allow_backward: true,
  };

  // Create comprehension check survey
  var comprehensionSurvey = {
    type: "survey-multi-choice",
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
      resp = JSON.parse(data.values()[0]["responses"]);
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

  // Create consent + instructions trial
  var supervisedTrialInstructions = {
    type: "instructions",
    pages: [
      "Well done! We'll start with " +
        numSupervisedTrials +
        " guided trials.<br><br>In these trials, we've added the correct indicator. Move your indicator so that the two indicators overlap.<br><br>",
    ],
    //force_wait: 1500,
    show_clickable_nav: true,
    allow_keys: false,
    allow_backward: true,
  };

  var reinforcementTrialInstructions = {
    type: "instructions",
    pages: [
      "Good! We'll next try several practice trials.<br><br><b>Find the indicator and aim it away from the object.</b><br><br>We'll help you by telling you how close you are to the correct answer.<br><br>",
    ],
    //force_wait: 1500,
    show_clickable_nav: true,
    allow_keys: false,
    allow_backward: true,
  };

  var unsupervisedTrialInstructions = {
    type: "instructions",
    pages: [
      "Okay! We are now ready to begin the real trials.<br><br>Sometimes the indicator can be hard to see. You may need to try moving the indicator to see it.<br><br>",
    ],
    //    force_wait: 1500,
    show_clickable_nav: true,
    allow_keys: false,
    allow_backward: true,
  };

  // Create goodbye trial (this doesn't close the browser yet)
  // TODO: Add prolific return link e.g. https://github.com/cogtoolslab/physics-benchmarking-neurips2021/blob/master/experiments/rollingsliding_pilot/js/setup.js#L402
  var goodbye = {
    type: "instructions",
    pages: [
      "Thanks for participating in our experiment! You are all done. Please click the 'Next' button to submit this study. The following page will be blank but means that your participation has been submitted.<br> \
      If you have any questions, feel free to email us at <a href='mailto:rschaef@stanford.edu'>rschaef@stanford.edu</a>.",
    ],
    show_clickable_nav: true,
    allow_backward: false,
    on_finish: () => {
      // do something to give credit to participants
      //completion_url = "https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=1989&credit_token=c41f43c84bd44f4f8412479930659e9c&survey_code=" + SONA_ID
      // window.open("https://app.prolific.co/submissions/complete?cc=1BD370CB", "_self")
    },
  }; // close goodbye

  // exit survey trials
  // var surveyChoiceInfo = _.omit(_.extend({}, additionalInfo, new Experiment), ['type', 'dev_mode']);
  // var exitSurveyChoice = _.extend({}, surveyChoiceInfo, {
  //   type: 'survey-multi-choice',
  //   preamble: "<strong><u>Exit Survey</u></strong>",
  //   questions: [
  //   ],
  //   on_finish: trialOnFinish
  // }); // close exitSurveyChoice

  // Add survey page after trials are done
  var surveyTextInfo = _.omit(_.extend({}, additionalInfo), [
    "type",
    "dev_mode",
  ]);
  var exitSurveyText = _.extend({}, surveyTextInfo, {
    type: "survey-text",
    preamble: "<strong><u>Exit Survey</u></strong>",
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
        name: "participantAge",
        prompt: "What is your year of birth?",
        placeholder: "e.g. 1766",
        required: true,
      },
      {
        prompt: "What is your gender?",
        name: "participantSex",
        horizontal: false,
        options: ["Male", "Female", "Other", "Do Not Wish To Say"],
        required: true,
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
    on_finish: trialOnFinish,
  }); // close exitSurveyText

  // add experiment elements to trials array
  var experiment = [];
  if (forceFullscreen) experiment.push(enterFullscreen);
  if (includeIntro) experiment.push(welcome);
  if (includeQuiz) experiment.push(checkComprehensionSurvey);
  if (includeSupervisedTrials) {
    experiment.push(supervisedTrialInstructions);
    // concat is JS's version of Python's extend
    experiment.push(...sessionTrials.slice(0, numSupervisedTrials));
  }
  if (includeReinforcementTrials) {
    experiment.push(reinforcementTrialInstructions);
    // concat is JS's version of Python's extend
    experiment.push(
      ...sessionTrials.slice(
        numSupervisedTrials,
        numSupervisedTrials + numReinforcementTrials
      )
    );
  }
  experiment.push(unsupervisedTrialInstructions);
  // concat is JS's version of Python's extend
  experiment.push(
    ...sessionTrials.slice(numReinforcementTrials + numSupervisedTrials)
  );

  // var experiment = setup.concat(trials);

  // if (includeExitSurvey) experiment.push(exitSurveyChoice);
  if (includeExitSurvey) experiment.push(exitSurveyText);
  if (includeGoodbye) experiment.push(goodbye);
  if (forceFullscreen) experiment.push(exitFullscreen);

  // create jspsych timeline object
  jsPsych.init({
    timeline: experiment,
    default_iti: 1000,
    show_progress_bar: true,
  });

  // what actually runs the game? jsPsych.init does not?
} // close setupGame

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

// function buildAndRunExperiment(sessionTemplate) {
//   /*
//   This function should be modified to fit your specific experiment needs.
//   The code you see here is an example for one kind of experiment.

//   The function receives stimuli / experiment configs from your database,
//   and should build the appropriate jsPsych timeline. For each trial, make
//   sure to specify an onFinish function that saves the trial response.
//     --> see `stim_on_finish` function for an example.
// */
//   if (DEBUG_MODE) {
//     console.log("building experiment with config: ", sessionTemplate);
//   }
//   var gameid = sessionTemplate.gameid;
//   var inputID = sessionTemplate.inputid;

//   var timeline = [];

//   var experimentTrials = sessionTemplate.data["trials"];
//   var familiarizationTrials = sessionTemplate.data["familiarization_trials"];
//   var metadata = sessionTemplate.data["metadata"];

//   var instruction_pages = [
//     "<p>Welcome to our experiment! To continue reading the instructions please hit the right arrow key.</p>",
//     "<p>Welcome to this experiment. This experiment should take a total of <strong>15 minutes</strong>. </br></br> You will be compensated at a base rate of $15/hour for a total of $3.75, which you will receive as long as you complete the study.</p>",
//     "<p>We take your compensation and time seriously! The main experimenter's email for this experiment is <a href='mailto:yyf@mit.edu'>yyf@mit.edu</a>. </br></br> Please write this down now, and email us with your Prolific ID and the subject line <i>Human experiment compensation for match-to-sample experiment</i> if you have problems submitting this task, or if it takes much more time than expected.</p>",
//     "<p>In this experiment, you will be asked to determine the shape of an object, indicated by a red dot.\nDuring the experiment, objects will be camouflaged against the background. The objects in question are simple, 3D shapes, \n and when they're not camouflaged, look like these shapes: <br><br> \n<img height=450, width=800, src='https://gestalt-scenes.s3.us-east-2.amazonaws.com/experiment_media/static_detection/all_stims.gif'></img></p>",
//     "<p>Objects can appear anywhere in a scene. At the start of a trial, the red dot will flash over the object you need to identify. There will be two options underneath - all you need to do is simply click the correct shape below! You can see an example trial here: <br><img src='https://gestalt-scenes.s3.us-east-2.amazonaws.com/experiment_media/m2s/m2s_example.gif' width=512, height=512></p>",
//     "<p>Sometimes, the options you need to choose between might look very similar (even indistinguishable). Don't get frustrated - that's just part of the experiment! You should expect that some of these trials <i>might</i> be too difficult to solve, so if you're having a hard time figuring out the correct answer just go with your best guess and move on to the next trial.</p>",
//     "<p>If you guess randomly on every trial you should expect to get a score of 50%. We have some checks in place to detect random guessing - low effort responses will be removed and won't be compensated. Bonuses will be given out to participants who score high enough above random chance.</p>",
//     "<p>Ready? Once you continue there will be six practice trials, and then the experiment will begin.</p><p>You won't be able to review any of the instructions after this page, so to review any of the instructions now just hit the back arrow to return to a previous page.</p>",
//   ];

//   var trials = [];
//   var preload = {
//     type: jsPsychPreload,
//     auto_preload: true,
//     on_start: function () {
//       document.body.style.backgroundColor = "#fff";
//     },
//   };

//   var consent = {
//     type: jsPsychExternalHtml,
//     url: "consent.html",
//     cont_btn: "start",
//   };

//   var instructions = {
//     type: jsPsychInstructions,
//     pages: instruction_pages,
//     show_clickable_nav: true,
//   };

//   trials.push(preload);
//   if (!DEBUG_MODE) {
//     trials.push(consent);
//   }
//   trials.push(instructions);

//   /******************** Familiarization Trials **********************/
//   for (var i = 0; i < familiarizationTrials.length; i++) {
//     var trialData = familiarizationTrials[i];
//     var gt_first = Math.random() > 0.5;
//     var choices = gt_first
//       ? [trialData.gt_shape_url, trialData.alt_shape_url]
//       : [trialData.alt_shape_url, trialData.gt_shape_url];
//     var trial = {
//       type: m2sTrial,
//       stimulus: trialData.image_url,
//       choices: choices,
//       correct_choice: gt_first ? 0 : 1,
//       probe_location: trialData.probe_location,
//       button_html: "<img height='128px' src=%choice%></img>",
//       practice_trial: true,
//       debug: DEBUG_MODE,
//     };

//     trials.push(trial);
//   }

//   /****************** Pre-Experiment Warning ***************************/
//   trials.push({
//     type: jsPsychInstructions,
//     pages: [
//       "Great job! The experiment will begin on the next page. From here on out, you won't receive any feedback on  which is the correct shape. The scenes will also be camoflauged with a synthetic camoflauge texture, so get ready! \
//       Click 'Start' to begin the experiment.",
//     ],
//     allow_backward: false,
//     show_clickable_nav: true,
//     button_label_next: "Start",
//   });

//   function shuffle(array) {
//     let currentIndex = array.length,
//       randomIndex;

//     // While there remain elements to shuffle.
//     while (currentIndex != 0) {
//       // Pick a remaining element.
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;

//       // And swap it with the current element.
//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex],
//         array[currentIndex],
//       ];
//     }

//     return array;
//   }

//   /******************* Construct Actual Experiments ************************/
//   experimentTrials = shuffle(experimentTrials);
//   for (var index = 0; index < experimentTrials.length; index++) {
//     if (index == Math.floor(experimentTrials.length / 2)) {
//       var progressTrial = {
//         type: jsPsychInstructions,
//         pages: ["You're halfway through the experiment! Great job so far!"],
//         show_clickable_nav: true,
//         button_label_next: "Continue",
//         allow_backward: false,
//       };
//       trials.push(progressTrial);
//     }

//     var trialData = experimentTrials[index];

//     var onFinish = function (responseData) {
//       trial_index = responseData["index"];
//       if (DEBUG_MODE) {
//         console.log(trial_index);
//       }
//       var trial_data = [experimentTrials[trial_index], responseData].reduce(
//         function (r, o) {
//           Object.keys(o).forEach(function (k) {
//             r[k] = o[k];
//           });
//           return r;
//         },
//         {}
//       );
//       trial_data["gameid"] = gameid;

//       if (DEBUG_MODE) {
//         console.log(trial_data);
//       }
//       logTrialtoDB(trial_data);
//     };

//     var gt_first = Math.random() > 0.5;
//     choices = gt_first
//       ? [trialData.gt_shape_url, trialData.alt_shape_url]
//       : [trialData.alt_shape_url, trialData.gt_shape_url];

//     var trial = {
//       type: jsPsych2afcResponse,
//       index: index,
//       stimulus: trialData.image_url,
//       choices: choices,
//       correct_choice: gt_first ? 0 : 1,
//       probe_location: trialData.probe_location,
//       button_html: "<img height='128px' src=%choice%></img>",
//       practice_trial: false,
//       debug: DEBUG_MODE,
//       on_finish: onFinish,
//     };

//     trials.push(trial);
//   }

//   var commentsBlock = {
//     type: jsPsychSurveyText,
//     preamble: `<p>Thank you for participating in our study.</p><p><strong>Click "Finish" to complete the experiment and
//       receive compensation.</strong> If you have any comments, please let us know in the form below.</p>`,
//     questions: [{ prompt: "Do you have any comments to share with us?" }],
//     button_label: "Finish",
//     on_finish: function (comments) {
//       logTrialtoDB(comments);
//       document.body.innerHTML = `<p> Please wait. You will be redirected back to Prolific in a few moments.
//         </p> If not, please use the following completion code to ensure \
//         compensation for this study: B4A98EE7`;
//       setTimeout(function () {
//         location.href =
//           "https://app.prolific.co/submissions/complete?cc=B4A98EE7";
//       }, 500);
//     },
//   };
//   trials.push(commentsBlock);

//   if (DEBUG_MODE) {
//     console.log(trials);
//   }

//   var jsPsych = initJsPsych({
//     timeline: trials,
//     default_iti: 1000,
//     show_progress_bar: true,
//   });

//   jsPsych.run(trials);
// }
