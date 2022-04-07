const urlParams = parseURLParams(window.location.href);
const debug = get(urlParams, "debug")

function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
      queryEnd   = url.indexOf("#") + 1 || url.length + 1,
      query = url.slice(queryStart, queryEnd - 1),
      pairs = query.replace(/\+/g, " ").split("&"),
      params = {}, 
      i, n, v, nv;

  if (query === url || query === "") return;

  for (i = 0; i < pairs.length; i++) {
      nv = pairs[i].split("=", 2);
      n = decodeURIComponent(nv[0]);
      v = decodeURIComponent(nv[1]);

      if (!params.hasOwnProperty(n)) params[n] = v;
  }
  return params;
}

function get(object, key, default_value) {
  var result = object[key];
  return (typeof result !== "undefined") ? result : default_value;
}

function sendData(trial_data) {
  $.ajax({
    type: "POST",
    url: "/post_data",
    contentType: 'application/json;charset=UTF-8',
    data: JSON.stringify({
      trial_data: trial_data,
    }),
    dataType: "json",
    success: function (resp) {
      console.log(resp);
    },
  })
}

function constructExperimentTrials(experimentData, experimentConfig){ 
    var trials = [];
    var preload = {
      type: jsPsychPreload,
      auto_preload: true,
      on_start: function () {
        document.body.style.backgroundColor = "#fff";
      }
    };
    
    var consent = {
      type: jsPsychExternalHtml,
      url: "consent.html",
      cont_btn: "start",
    }
    
    var instructions = {
      type: jsPsychInstructions,
      pages: experimentConfig["instructions"],
      show_clickable_nav: true,
    }

    trials.push(preload);
    if (!debug) {
      trials.push(consent);
    }
    trials.push(instructions);

    numPracticeTrials = experimentConfig["num_practice_trials"]
    experimentTrialType = experimentConfig["experiment_trial_type"]

    var practiceTrial;
    for (var i = 0; i < experimentData.length; i ++) {
      practiceTrial = (i < numPracticeTrials) ? true : false;

      var trialData = experimentData[i];
      var onFinish = function (responseData) {
        var trial_data = { ...responseData, ...trialData }
        sendData(trial_data)
      }

      if (experimentTrialType == "plugin-probe-detection-task") {
        var trial = {
          type: jsPsychProbeDetectionTask,
          stimulus: trialData.image_url,
          stimulus_index: (trialData.frame_idx, trialData.mask_idx),
          probe_location: trialData.probe_location,
          probe_touching: trialData.probe_touching,
          gt_bounding_box: trialData.gt_bounding_box,
          practice_trial: practiceTrial,
          debug: debug,
          on_finish: onFinish,
        } 
      } else {
        var trial = {};
        console.log("No trial built for trial type: ", experimentTrialType);
      }

      trials.push(trial)
    }

    return trials;
}

function setupExperiment() { 
    var domain = get(urlParams, "domain")
    var experiment = get(urlParams, "experiment")
    var batch = get(urlParams, "batch")

    $.ajax({
      type: "GET",
      url: "/get_trial_data",
      data: { domain: domain, experiment: experiment,  batch: batch},
      dataType: "json",
      success: function (response) {
        var experimentData = response["experimentData"]
        var experimentConfig = response["experimentConfig"]
        trials = constructExperimentTrials(experimentData, experimentConfig);

        var commentsBlock = {
          type: jsPsychSurveyText,
          preamble:
            '<p>Thank you for participating in our study.</p><p><strong>Click "Finish" to complete the experiment and receive compensation.</strong> If you have any comments, please let us know in the form below.</p>',
          questions: [{ prompt: "Do you have any comments to share with us?" }],
          button_label: "Finish",
          on_finish: function () {
            document.body.innerHTML =
              "<p> Please wait. You will be redirected back to Prolific in a few moments.</p> If not, please use the following completion code to ensure \
              compensation for this study: " + response["completionCode"];
            setTimeout(function () {
              location.href =
                "https://app.prolific.co/submissions/complete?cc=" + response["completionCode"]  // add correct completion code
            }, 500);
            sendData();
          },
        }
        trials.push(commentsBlock);
        
        if (debug) {
          console.log(trials);
        }

        jsPsych.run(trials);
      },
    });
}
