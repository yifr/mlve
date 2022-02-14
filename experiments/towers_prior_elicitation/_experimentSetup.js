/** Experiment Setup
 * This file is intended to be shared between all language abstraction experiments.
 * It should take a config json file, and generate a jspsych timeline
 * Requirements:
 *  - all required jspsych plugins should be loaded in the html page that calls this function
 */

function setupExperiment() {
  var urlParams = getURLParams(); // getURLParams from experimentUtils

  var socket = io.connect();

  var main_on_finish = function (data) {
    socket.emit("currentData", data);
    console.log("emitting data");
  };

  var config;
  var stimIds;
  var stimURLs;
  var stimuli;
  var trials;
  var timeline = [];

  /* #### grab config from server #### */

  // config is requested by configId URL parameter, and defines experiment parameters
  // Fetch config file using naming convention.
  socket.emit(
    "getConfig",
    {
      configId: urlParams.configId,
      experimentGroup: urlParams.experimentGroup,
    },
    (res) => {
      if (res.config == null) {
        console.log(
          "Error loading config. Ensure you have correct experiment group and config name e.g. experiment.html?configId=config_name&experimentGroup=exp_group_name"
        );
      } else {
        config = JSON.parse(res.config);
        console.log("Loaded config: " + config.configName);

        /* #### Load stimuli, then setup trials with those stimuli #### */

        stimuli = loadStims(setupTrials); // load stimuli from config file.
      }
    }
  );

  function loadStims(callback) {
    // Load stimuli- this function will be different for each experiment

    // TODO: Obtain stimulus ids- this could be e.g. a subset of stims obtained from mongo
    stimIds = ["003", "004", "005"]; // hardcoded subset for now

    // Generate urls from stim ids. These use the config and follow a naming convention
    stimURLs = getStimSetURLS(config.stimulusSetsInfo[0], stimIds);

    // Load stimuli. WPM: Here I've written something to get JSONs from their URLs. The same pattern may be useful for images, although jspsych has built in ways of preloading images which are probably better.
    getStimSetJSONs(stimURLs, (stims) => {
      console.log(stims);
      callback(stims);
    });
  }

  var trials = [];

  var setupTrials = function (stims) {
    // ##### setup actual trials #####

    /* #### TODO: Set up trials according to config #### */

    // TODO: set up stimulus sets/ conditions

    // TODO: randomize order of stims OR collect ordering/ stim batch from mongo. This will vary according to experiment.

    // TODO: generate trials of correct plugin type, according to domain type in config

    // Here is where we could set up a more complex trial structure. Right now it assumes one kind of trial
    // We could do this with an outer loop that iterates over conditions, trialPlugins etc, replaceing 0 with this variable
    for (i = 0; i < stims.length; i++) {
      // Add variables depending on the kind of plugin needed
      let trial = {
        type: config.trialPlugins[0], // 0 here assumes there is one kind of trial and one kind of plugin
        stimulus: stims[i],
        stimURL: stimURLs[i],
        stimId: stimIds[i],
        questions: [
          // can add more questions for each stimulus here if wanted
          {
            prompt: config.labelPrompt, // grab prompt from config. Can add things like new lines with   + "</p>"
            required: true,
            columns: 20,
          },
        ],
        post_trial_gap: 500,
      };
      // console.log(trial);

      trials.push(trial);
    }

    // return trials;
    console.log("trials:", trials);

    /* #### TODO: set up standard timeline items #### */

    // consent form
    var consent = {
      type: "external-html",
      url: "../html/consent.html",
      cont_btn: "start",
    };

    // TODO: Create Instructions according to config

    // TODO: Create exit survey according to config

    var goodbye = {
      type: "instructions",
      pages: [
        "Congrats! You are all done. Thanks for participating in our experiment! \
      Click NEXT to submit this study.",
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: false,
      on_finish: function () {
        document.body.innerHTML =
          "<p> Please wait. You will be redirected back to Prolific in a few moments.</p>";
        setTimeout(function () {
          location.href =
            "https://app.prolific.co/submissions/complete?cc=1580086C"; // add correct completion code
        }, 500);
        sendData();
      },
      //change the link below to your prolific-provided URL
      // window.open("https://app.prolific.co/submissions/complete?cc=7A827F20","_self");
    };

    // timeline.push(consent);
    timeline.push({ timeline: trials });
    // timeline.push(exitSurveyChoice)
    // timeline.push(multi_choice_block)
    timeline.push(goodbye);

    /* #### Initialize jsPsych with timeline #### */

    jsPsych.init({
      timeline: timeline,
      on_trial_finish: function (trialData) {
        // Merge data from a single trial with
        // variables to be uploaded with all data
        var packet = _.extend({}, trialData, {
          // prolificId(s): TODO: Hash and store prolific ID(s) in other file
          dbname: config.dbname,
          colname: config.colname,
          iterationName: "testPilot",
          configId: config.configId,
          configName: config.configName,
        });

        console.log(trialData);
        socket.emit("currentData", packet); //save data to mongo
      },
      on_finish: function () {
        console.log(jsPsych.data.get().values());
      },
      //   preload_images: all_imgs
      // preload_images: _.map(stimuli, "target"),
    });
  };
}

// WPM: just saved these here for reference- feel free to remove if not helpful

// var instructions = {
//   type: "html-button-response",
//   stimulus: "<p>In this experiment, you will see one picture on the screen at a time.</p>\
//   <p>Please describe this object as best as you can in <strong>one or two words</strong>.</p>",
//   choices: ['Start'],
//   data: {test_part: 'setup'},
//   post_trial_gap: 1000
// };
// timeline.push(instructions);

// var iso_item_block = {
//   type: "html-button-response",
//   stimulus:
//     "<p>In this experiment, you will see one picture on the screen at a time.</p>\
// <p>Please describe this object as best as you can in <strong>one or two words</strong>.</p><p>",
//   choices: ["Continue"],
//   data: { test_part: "block-setup" },
//   post_trial_gap: 500,
// };

// //load stimuli
// var stimuli = [];

// // for (var i = 0, j = 1; i < j; i++){ //don't hardcode stim count...
// //     stimuli.push({target: "prior-stimuli/tower_"+i+".png"});
// //     // stimuli.push({target: "../../stimuli/tower_stim_silhouettes/tower_"+i+".png"});
// //     // stimuli.push({target: "../stimuli/tower_stim_unique_silhouettes/tower_"+i+".png"});
// // }

// var iso_trial = {
//   type: "survey-text",
//   preamble: function () {
//     var target =
//       "<img style='border: 10px solid blue; margin: 50px' src='" +
//       jsPsych.timelineVariable("target", true) +
//       "' height='200px'>";
//     return target;
//   },
//   questions: [
//     {
//       prompt: "Describe the object in <strong>one or two words</strong>",
//       required: true,
//       columns: 20,
//     },
//   ],
//   post_trial_gap: 500,
// };

// var prior_iso_trial = {
//   timeline: [iso_trial],
//   timeline_variables: stimuli,
//   randomize_order: true,
//   repetitions: 1,
//   data: { test_part: "trial" },
// };

// // var alltrials = jsPsych.randomization.sampleWithoutReplacement([tangram_close_trial, tangram_far_trial, tangram_iso_trial,familiar_close_trial, familiar_far_trial, familiar_iso_trial], 6);
// //var alltrials = jsPsych.randomization.sampleWithoutReplacement([prior_iso_trial], 1);
// var alltrials = jsPsych.randomization.repeat([prior_iso_trial], 1);
// // var exitSurveyChoice = {
// //   type: 'survey-multi-choice',
// //   preamble: "<strong><u>Survey</u></strong>",
// //   questions: [{
// //     prompt: "What is your sex?",
// //     name: "participantSex",
// //     horizontal: true,
// //     options: ["Male", "Female", "Neither/Other/Do Not Wish To Say"],
// //     required: true
// //   },
// //   {
// //     prompt: "Did you encounter any technical difficulties while completing this study? \
// //         This could include: images were glitchy (e.g., did not load), ability to click \
// //         was glitchy, or sections of the study did \
// //         not load properly.",
// //     name: "technicalDifficultiesBinary",
// //     horizontal: true,
// //     options: ["Yes", "No"],
// //     required: true
// //   }
// //   ],
// //   on_finish: main_on_finish
// // };
// // var multi_choice_block = {
// //     type: 'survey-text-exit',
// //   questions: [
// //     { prompt: "Please enter your age:" },
// //     { prompt: "What strategies did you use to describe the shapes?", rows: 5, columns: 40 },
// //     { prompt: "Any final thoughts?", rows: 5, columns: 40 }
// //   ],
// //   on_finish: main_on_finish
// // };

// var goodbye = {
//   type: "instructions",
//   pages: [
//     "Congrats! You are all done. Thanks for participating in our experiment! \
//   Click NEXT to submit this study.",
//   ],
//   show_clickable_nav: true,
//   allow_backward: false,
//   delay: false,
//   on_finish: function () {
//     // $(".confetti").remove();
//     document.body.innerHTML =
//       "<p> Please wait. You will be redirected back to Prolific in a few moments.</p>";
//     setTimeout(function () {
//       location.href =
//         "https://app.prolific.co/submissions/complete?cc=1580086C";
//     }, 500);
//     sendData();
//   },
//   //change the link below to your prolific-provided URL
//   // window.open("https://app.prolific.co/submissions/complete?cc=7A827F20","_self");
// };

// for (i = 0; i < alltrials.length; i++) {
//     console.log(alltrials[i].data)
//   //   if(alltrials[i].data.competitor_type != "isolated")
//   //         timeline.push(paired_item_block)
//   //   else
//       timeline.push(iso_item_block)
//     timeline.push(alltrials[i]);
// }
