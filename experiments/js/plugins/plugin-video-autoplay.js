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
            description: "The URL for the image cues.",
          },
          practiceTrial: {
            type: jspsych.ParameterType.BOOLEAN,
            pretty_name: "Practice Trial",
            default: false,
            description: "Whether this is a practice trial",
          }
        }
    }

    class videoAutoPlay {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
          }
        trial(display_element, trial) {
            var html = "<div>";
            if (trial.practiceTrial) {
                html += "<h3>Practice Trial</h3>";
            }
            html += `
                    <video id="video" src="${trial.imageURL}" type="video/mp4"
                    preload autoplay width="512" height="512"
                    style="pointer-events: none;
                           padding: 0px;
                           margin: 0px;"/>
                    </video>
            `

            //display buttons
            var buttons = [
                '<button disabled class="jspsych-btn">%choice%</button>',
                '<button disabled class="jspsych-btn">%choice%</button>'
            ]
            var choices = ["Yes", "No"]
            html += '<div id="jspsych-image-button-response-btngroup">';
            for (var i = 0; i < choices.length; i++) {
              var str = buttons[i].replace(/%choice%/g, choices[i]);
              html +=
                '<div class="jspsych-image-button-response-button"'+
                ' style="display: inline-block; margin:0px 8px"' +
                ' id="jspsych-image-button-response-button-' +
                i +
                '" data-choice="' +
                i +
                '">' +
                str +
                "</div>";
            }
            html += "</div>";
            // add prompt
            var prompt = "<p>Is the center of the dot touching an object?</p>"
            if (prompt !== null) {
              html += prompt;
            }

            html += "</div>";
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
