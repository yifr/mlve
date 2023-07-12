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
      choices: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Choices",
        default: undefined,
        array: true,
      },
      correct_choice: {
        type: jspsych.STRING,
        pretty_name: "Which option is correct",
        default: undefined,
      },
      /** How long to show the stimulus. */
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Stimulus duration of main sample",
        default: null,
      },
      /** Set the image height in pixels */
      stimulus_height: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Image height",
        default: 512,
      },
      /** Set the image width in pixels */
      stimulus_width: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Image width",
        default: 512,
      },
      /** Array containing the label(s) for the button(s). */
      index: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Trial Index",
        default: 0,
      },
      practice_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Whether or not it's a practice trial",
        default: false,
      },
      /** The HTML for creating button. Can create own style. Use the "%choice%" string to indicate where the label from the choices parameter should be inserted. */
      button_html: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Button HTML",
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
      },
      /* How long to show the choice stimuli */
      choice_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Match duration of choice stimuli",
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
   */
  class ImageButtonResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      var height, width;
      var html;
      if (trial.debug) {
        console.log("Correct Answer: " + trial.correct_choice);
      }
      if (trial.render_on_canvas) {
        var image_drawn = false;
        // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
        if (display_element.hasChildNodes()) {
          // can't loop through child list because the list will be modified by .removeChild()
          while (display_element.firstChild) {
            display_element.removeChild(display_element.firstChild);
          }
        }
        // create canvas element and image
        var canvas = document.createElement("canvas");
        canvas.id = "jspsych-image-button-response-stimulus";
        canvas.style.margin = "0";
        canvas.style.padding = "0";
        var ctx = canvas.getContext("2d");
        var img = new Image();

        img.src = trial.stimulus;
        img.onload = () => {
          // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
          getHeightWidth(); // only possible to get width/height after image loads
          ctx.drawImage(img, 0, 0, width, height);


        // get/set image height and width - this can only be done after image loads because uses image's naturalWidth/naturalHeight properties
        const getHeightWidth = () => {
          if (trial.stimulus_height !== null) {
            height = trial.stimulus_height;
            if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
              width =
                img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
            }
          } else {
            height = img.naturalHeight;
          }
          if (trial.stimulus_width !== null) {
            width = trial.stimulus_width;
            if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
              height =
                img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
            }
          } else if (
            !(trial.stimulus_height !== null && trial.maintain_aspect_ratio)
          ) {
            // if stimulus width is null, only use the image's natural width if the width value wasn't set
            // in the if statement above, based on a specified height and maintain_aspect_ratio = true
            width = img.naturalWidth;
          }
          canvas.height = height;
          canvas.width = width;
        };
        getHeightWidth(); // call now, in case image loads immediately (is cached)
        // create buttons
        var buttons = [];
        if (Array.isArray(trial.button_html)) {
          if (trial.button_html.length == trial.choices.length) {
            buttons = trial.button_html;
          } else {
            console.error(
              "Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array"
            );
          }
        } else {
          for (var i = 0; i < trial.choices.length; i++) {
            buttons.push(trial.button_html);
          }
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
        if (img.complete && Number.isFinite(width) && Number.isFinite(height)) {
          // if image has loaded and width/height have been set, then draw it now
          // (don't rely on img onload function to draw image when image is in the cache, because that causes a delay in the image presentation)
          ctx.drawImage(img, 0, 0, width, height);
          image_drawn = true;
        }
        // add buttons to screen
        display_element.insertBefore(btngroup_div, canvas.nextElementSibling);
        // add prompt if there is one
        if (trial.prompt !== null) {
          display_element.insertAdjacentHTML("beforeend", trial.prompt);
        }
      } else {
        // display stimulus as an image element
        html =
          '<img src="' +
          trial.stimulus +
          '" id="jspsych-image-button-response-stimulus">';
        //display buttons
        var buttons = [];
        if (Array.isArray(trial.button_html)) {
          if (trial.button_html.length == trial.choices.length) {
            buttons = trial.button_html;
          } else {
            console.error(
              "Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array"
            );
          }
        } else {
          for (var i = 0; i < trial.choices.length; i++) {
            buttons.push(trial.button_html);
          }
        }
        html += '<div id="jspsych-image-button-response-btngroup">';
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
        html += "</div>";
        // add prompt
        if (trial.prompt !== null) {
          html += trial.prompt;
        }
        // update the page content
        display_element.innerHTML = html;
        // set image dimensions after image has loaded (so that we have access to naturalHeight/naturalWidth)
        var img = display_element.querySelector(
          "#jspsych-image-button-response-stimulus"
        );
        if (trial.stimulus_height !== null) {
          height = trial.stimulus_height;
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            width =
              img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
          }
        } else {
          height = img.naturalHeight;
        }
        if (trial.stimulus_width !== null) {
          width = trial.stimulus_width;
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            height =
              img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
          }
        } else if (
          !(trial.stimulus_height !== null && trial.maintain_aspect_ratio)
        ) {
          // if stimulus width is null, only use the image's natural width if the width value wasn't set
          // in the if statement above, based on a specified height and maintain_aspect_ratio = true
          width = img.naturalWidth;
        }
        img.style.height = height.toString() + "px";
        img.style.width = width.toString() + "px";
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
          // probe_location: trial.probe_location,
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
