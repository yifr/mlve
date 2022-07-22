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
                    <video id="video" src="${trial.imageURL}" type="video/mp4"
                    preload autoplay style="pointer-events: none;"/>
                </div>
                <br><br>
            `
            display_element.innerHTML = html
            var video = document.getElementById("video");
            var jsp = this.jsPsych

            video.addEventListener("ended", function() {
                // kill any remaining setTimeout handlers
                jsp.pluginAPI.clearAllTimeouts();
                var trial_data = {}
                // clear the display
                // display_element.innerHTML = "";
                // move on to the next trial
                jsp.finishTrial(trial_data);
            }, false)
        }
    }
    videoAutoPlay.info = info;
    return videoAutoPlay;
})(jsPsychModule);
