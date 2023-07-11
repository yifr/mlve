var m2sTrial = (function (jspsych) {
  "use strict";

  const info = {
    name: "plugin-m2s-task",
    parameters: {
      /** The image to be displayed */
      stimulus: {
        type: jspsych.ParameterType.IMAGE,
        pretty_name: "Stimulus",
        default: undefined,
      },
      correct_choice: {
        type: jspsych.STRING,
        pretty_name: "Correct Choice",
        default: undefined,
      },
      /** Set the image height in pixels */
      stimulus_height: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Image height",
        default: 400,
      },
      /** Set the image width in pixels */
      stimulus_width: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Image width",
        default: 400,
      },
      /** Maintain the aspect ratio after setting width or height */
      maintain_aspect_ratio: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Maintain aspect ratio",
        default: true,
      },
      /** Array containing the label(s) for the button(s). */
      index: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Trial Index",
        default: 0,
      },
      choices: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Choices",
        default: undefined,
        array: true,
      },
      practice_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Instructions",
        default: false,
      },
      /** The HTML for creating button. Can create own style. Use the "%choice%" string to indicate where the label from the choices parameter should be inserted. */
      button_html: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Button HTML",
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
      },
      /** How long to show the stimulus. */
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Stimulus duration",
        default: null,
      },
      /* How long to show the choice stimuli */
      match_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Match stimuli duration",
        default: null,
      },
      /** How long to show the trial. */
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Trial duration",
        default: null,
      },
      /** Any content here will be displayed under the button. */
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Prompt",
        default: "<p id='prompt'>Which object did you just see?</p>",
      },
      /** Whether to log debug messages in the console **/
      debug: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Debug",
        default: false,
      },
    },
  };
  /**
   * **image-button-response**
   *
   * Timed Match-to-Sample:
   * Presents a stimulus / target image for a specified duration of time after a fixation cross
   * Then presents two targets for a fixed duration of time.
   * Those targets are then masked out, but the participant has unlimited time to choose an option.
   *
   * @author Josh de Leeuw
   * @see {@link https://www.jspsych.org/plugins/jspsych-image-button-response/ image-button-response plugin documentation on jspsych.org}
   */
  class ImageButtonResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      
        // create canvas element and image
        var canvas = document.createElement("canvas");
        canvas.id = "jspsych-image-button-response-stimulus";
        canvas.style.margin = "0";
        canvas.style.padding = "0";
        var ctx = canvas.getContext("2d");
        var img = new Image();
  
        
        // Create stimulus
        img.src = trial.stimulus;
        img.onload = () => {
          canvas.width = width;
          canvas.height = height;
        };
        
        // create buttons
        var buttons = [];
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      
        var btngroup_div = document.createElement("div");
        btngroup_div.id = "jspsych-image-button-response-btngroup";
        html = "";
      
        for (var i = 0; i < trial.choices.length; i++) {
          var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
          html +=
            '<div class="jspsych-image-button-response-button" style="display: inline-block; margin:' +
            trial.margin_vertical +
            " " +
            trial.margin_horizontal +
            '" id="jspsych-image-button-response-button-' +
            i +
            '" data-choice="' +
            i +
            '">' +
            str +
            "</div>";
        }
      
        btngroup_div.innerHTML = html;
      
        // add canvas to screen and draw image
        display_element.insertBefore(canvas, null);
        ctx.drawImage(img, 0, 0, width, height);
      
        // add buttons to screen
        display_element.insertBefore(btngroup_div, canvas.nextElementSibling);
        
        // add prompt if there is one
        if (trial.prompt !== null) {
          display_element.insertAdjacentHTML("beforeend", trial.prompt);
        
      } 
      // start timing
      var start_time = performance.now();
      for (var i = 0; i < trial.choices.length; i++) {
        display_element
          .querySelector("#jspsych-image-button-response-button-" + i)
          .addEventListener("click", (e) => {
            var btn_el = e.currentTarget;
            var choice = btn_el.getAttribute("data-choice"); // don't use dataset for jsdom compatibility
            after_response(choice);
          });
      }
      // store response
      var response = {
        rt: null,
        button: null,
      };
      
      // function to end trial when it is time
      const end_trial = () => {
        // kill any remaining setTimeout handlers
        this.jsPsych.pluginAPI.clearAllTimeouts();
        // gather the data to store for the trial
        var correct = response.button == trial.correct_choice;
        if (trial.practice_trial) {
          if (!correct) {
            var prompt =
              "Good try! The correct answer is actually the other shape! Click the correct shape to continue.";
            display_element.querySelector("#prompt").innerHTML = prompt;
            return;
          }
        }
        if (trial.debug) {
          console.log("Correct: " + correct);
        }

        var trial_data = {
          rt: response.rt,
          index: trial.index,
          stimulus: trial.stimulus,
          response: response.button,
          correct: correct,
          correct_choice: trial.correct_choice,
          choices: trial.choices,
        };

        // clear the display
        display_element.innerHTML = "";
        // move on to the next trial
        this.jsPsych.finishTrial(trial_data);
      };
      
      // function to handle responses by the subject
      function after_response(choice) {
        // measure rt
        var end_time = performance.now();
        var rt = Math.round(end_time - start_time);
        response.button = parseInt(choice);
        response.rt = rt;
        
        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        display_element.querySelector(
          "#jspsych-image-button-response-stimulus"
        ).className += " responded";
        // disable all the buttons after a response
        var btns = document.querySelectorAll(
          ".jspsych-image-button-response-button button"
        );
        for (var i = 0; i < btns.length; i++) {
          //btns[i].removeEventListener('click');
          btns[i].setAttribute("disabled", "disabled");
        }
        if (trial.response_ends_trial) {
          end_trial();
        }
      }
      // hide image if timing is set
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          display_element.querySelector(
            "#jspsych-image-button-response-stimulus"
          ).style.visibility = "hidden";
        }, trial.stimulus_duration);
      }
      
      // end trial if time limit is set
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      } else if (trial.response_ends_trial === false) {
        console.warn(
          "The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true."
        );
      }
    }

  }
  ImageButtonResponsePlugin.info = info;

  return ImageButtonResponsePlugin;
})(jsPsychModule);
