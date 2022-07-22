var videoAutoPlay = (function (jspsych) {
    "use strict";
    var canvasWidthPercent = 1.0;
    var canvasHeightPercent = 1.0;

    const info = {
        name: "video-auto-play",
        parameters: {
          imageURL: {
            type: jspsych.ParameterType.STRING,
            pretty_name: "imageURL",
            default: undefined,
            array: true,
            description: "The URL for the image cues.",
          }
        }
    }

    class videoAutoPlay {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
          }
          trial(display_element, trial) {
            var html = `
                <div>
                    <video id="video" src="${trial.imageURL}" controls="false" autoplay="true"/>
                </div>
            `
            document.getElementById('video').addEventListener('ended', end_trial(), false);
            
            const end_trial = () => {
                // kill any remaining setTimeout handlers
                this.jsPsych.pluginAPI.clearAllTimeouts();
                var trial_data = {}
                // clear the display
                display_element.innerHTML = "";
                // move on to the next trial
                this.jsPsych.finishTrial(trial_data);
              };
          }
    }

    videoAutoPlay.info = info;
    return videoAutoPlay;
})(jsPsychModule);