var segmentationTrial = (function (jspsych) {
  "use strict";

  const info = {
    name: "plugin-segmentation-task",
    parameters: {
      /** The image to be displayed */
      stimulus: {
        type: jspsych.ParameterType.IMAGE,
        pretty_name: "Stimulus",
        default: undefined,
      },
      probe_locations: {
        type: jspsych.ParameterType.Array,
        pretty_name: "Probe Location",
        default: undefined,
      },
      correct_segmentation: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Correct Segmentation Option",
        default: null,
      },
      correct_depth: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Correct Depth Ordering",
        default: null,
      },
      /** Array containing the label(s) for the button(s). */
      index: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Trial Index",
        default: 0,
      },
      choices: {
        type: jspsych.ParameterType.Array,
        pretty_name: "Choices",
        default: undefined,
        array: true,
      },
      practice_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Instructions",
        default: false,
      },
      confidence_slider: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Confidence Slider",
        default: false,
        description: "Whether to display a confidence slider"
      },
      /** The HTML for creating button. Can create own style. Use the "%choice%" string to indicate where the label from the choices parameter should be inserted. */
      button_html: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Button HTML",
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
      },
      /** Any content here will be displayed under the button. */
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Prompt",
        default: "<p id='prompt'>Are these dots on the same object?</p>",
      },
      /** The vertical margin of the button. */
      margin_vertical: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Margin vertical",
        default: "0px",
      },
      /** The horizontal margin of the button. */
      margin_horizontal: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Margin horizontal",
        default: "8px",
      },
      /** If true, then trial will end when user responds. */
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Response ends trial",
        default: true,
      },
      /** Set the image height in pixels */
      stimulus_height: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Image height",
        default: null,
      },
      /** Set the image width in pixels */
      stimulus_width: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Image width",
        default: null,
      },
      /** Maintain the aspect ratio after setting width or height */
      maintain_aspect_ratio: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Maintain aspect ratio",
        default: true,
      },
      collect_depth_data: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Collect Depth Data",
        default: false,
      },
      viewing_time: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Viewing Time (ms)",
        default: -1,
      },
      probe_shape: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Probe Shape",
        default: "probe",
      },
      probe_size: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Probe Size",
        default: 10,
      },
      probe_color: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Probe Color",
        default: "yellow",
      },
      /**
       * If true, the image will be drawn onto a canvas element (prevents blank screen between consecutive images in some browsers).
       * If false, the image will be shown via an img element.
       */
      render_on_canvas: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Render on canvas",
        default: true,
      },
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
   * jsPsych plugin for displaying an image stimulus and getting a button response
   *
   * @author Josh de Leeuw
   * @see {@link https://www.jspsych.org/plugins/jspsych-image-button-response/ image-button-response plugin documentation on jspsych.org}
   */
  class ImageButtonResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      var height, width;
      var html;
      if (trial.debug) {
        console.log("Probe Locations: (" + trial.probe_locations[0] + "), (" + trial.probe_locations[1] + ")")
        console.log("Correct Answer: " + trial.correct_segmentation);
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

        function drawFixationCross(ctx) {
          ctx.globalCompositeOperation = "source-over";
          // Draw a small 40x40 fixation cross
          ctx.fillStyle = "black";
          ctx.fillRect(canvas.width / 2 - 1, canvas.height / 2 - 20, 2, 40);
          ctx.fillRect(canvas.width / 2 - 20, canvas.height / 2 - 1, 40, 2);
        }
        drawFixationCross(ctx);
        var img = new Image();

        img.src = trial.stimulus;
        img.onload = () => {
          // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
          getHeightWidth(); // only possible to get width/height after image loads
          ctx.drawImage(img, 0, 0, width, height);

          function drawStar(ctx, x, y, color) {
            ctx.globalCompositeOperation = "source-over";
            var x = parseInt(x);
            var y = parseInt(y);

            var alpha = (2 * Math.PI) / 10;
            var radius = trial.probe_size;
            ctx.beginPath();
            for(var i = 11; i != 0; i--)
            {
                var r = radius*(i % 2 + 1)/2;
                var omega = alpha * i;
                ctx.lineTo((r * Math.sin(omega)) + x, (r * Math.cos(omega)) + y);
            }
            ctx.closePath();
            if (color == "green") {
              ctx.fillStyle = "rgba(6, 255, 0, 0.5)";
            } else if (color == "red") {
              ctx.fillStyle = "rgba(255, 6, 0, 0.5)";
            } else if (color == "yellow") {
              ctx.fillStyle = "rgba(255, 255, 0, 1)";
            }
            ctx.fill();
          }

          function drawProbe(ctx, x, y, color) {
            ctx.globalCompositeOperation = "source-over";

            // Draw outer probe on canvas
            var x = parseInt(x);
            var y = parseInt(y);
            ctx.moveTo(x, y)
            ctx.beginPath();
            var radius = 5;

            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.strokeWidth = 2;
            ctx.strokeStyle = "#003300";
            ctx.stroke();
            ctx.fillStyle = "rgba(70, 50, 100, 0.5)";
            ctx.fill();
            ctx.closePath();

            // Draw inner probe on canvas
            ctx.beginPath();
            ctx.strokeWidth = 1;
            ctx.strokeStyle = "#003300";
            ctx.stroke()
            var radius = 3;
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            if (color == "green") {
              ctx.fillStyle = "rgba(6, 255, 0, 0.5)";
            } else if (color == "red") {
              ctx.fillStyle = "rgba(255, 6, 0, 0.5)";
            } else if (color == "yellow") {
              ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
            } else {
                ctx.fillStyle = color;
            }
            ctx.fill();
            return ctx;
          }

          function clearProbe(ctx, x, y) {
            // Create transparent circle at probe point
            var x = parseInt(x);
            var y = parseInt(y);
            var radius = 7;
            ctx.globalCompositeOperation = "destination-out";
            ctx.moveTo(x, y);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();
          }

          if (trial.probe_shape == "star") {
            var drawFunc = drawStar;
          } else {
            var drawFunc = drawProbe;
          }

          function flashProbe(ctx, x, y, color) {
            drawFunc(ctx, x, y, color);
            setTimeout(function () {
              clearProbe(ctx, x, y);
            }, 200);
            setTimeout(function () {
              drawFunc(ctx, x, y, color);
            }, 400);
            setTimeout(function () {
              clearProbe(ctx, x, y);
            }, 600);
            setTimeout(function () {
              drawFunc(ctx, x, y, color);
            }, 800);
          }

          var point0 = trial.probe_locations[0];
          var point1 = trial.probe_locations[1];

          if (trial.viewing_time > 0) {
            // Draw points on canvas immediately
            drawFunc(ctx, point0[0], point0[1], trial.probe_color);
            drawFunc(ctx, point1[0], point1[1], trial.probe_color);
            drawFixationCross(ctx);
            // Paint over image with white canvas after viewing time completes
            setTimeout(function () {
              ctx.fillStyle = "white";
              ctx.fillRect(0, 0, width, height);
              drawFixationCross(ctx);
            }, trial.viewing_time);
          } else {
            flashProbe(ctx, point0[0], point0[1], "red");
            flashProbe(ctx, point1[0], point1[1], "green");
          }
        }

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
        if (trial.confidence_slider) {
          html +=
            `
              <div class="slidecontainer">
                <p>How confident are you in your answer (from 1-10)? <span id="confidence-viewer"></span></p>
                <input type="range" min="1" max="10" value="5" class="slider" id="confidence-slider">
              </div>
              `
        }
        // update the page content
        display_element.innerHTML = html;
        if (trial.confidence_slider) {
          var conf_slider = document.getElementById("confidence-slider");
          var conf_viewer = document.getElementById("confidence-viewer");
          conf_viewer.innerHTML = conf_slider.value;
          conf_slider.oninput = function () {
            conf_viewer.innerHTML = this.value;
          }
        }

        // set image dimensions after image has loaded (so that we have access to naturalHeight/naturalWidth)
        var img = display_element.querySelector(
          "#jspsych-image-button-response-stimulus"
        );

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

      var segmentation_confidence = null;
      var segmentation_correct = null;
      var segmentation_response = null;
      var depth_response = null;
      var depth_confidence = null;
      var depth_correct = null;
      var run_segmentation_check = true;

      const check_segmentation_response = (choice) => {
        // Check if the segmentation question was answered correctly
        segmentation_response = choice;
          if (trial.correct_segmentation == null) {
              trial.correct_segmentation = trial.correctChoice;
          }
        segmentation_correct = choice == trial.correct_segmentation;
        if (trial.debug) {
          console.log("Correct Segmentation: ", trial.correct_segmentation)
          console.log("Segmentation Response: ", segmentation_response);
          console.log("Participant segmentation correct? ", segmentation_correct);
        }
        if (trial.confidence_slider) {
          segmentation_confidence = document.getElementById("confidence-slider").value;
        }

        if (trial.practice_trial) {
          if (!segmentation_correct) {
            run_segmentation_check = true;
            if (trial.correct_segmentation == 0) {
              var true_choice = "are NOT on the same object";
            } else if (trial.correct_segmentation == 1) {
              var true_choice = "ARE on the same object"
            }
            var prompt =
              "Good try! They actually " + true_choice + "! Click the correct button to continue.";
            display_element.querySelector("#prompt").innerHTML = prompt;

            // enable all the buttons after a response
            var btns = document.querySelectorAll(
              ".jspsych-image-button-response-button button"
            );
            return;
          }
        }

        if (trial.collect_depth_data) {
          if (segmentation_response == 0) {
            prompt = "Which probe is closer to the camera?"
            if (trial.practice_trial) {
              prompt = "Correct! " + prompt;
            }
              // enable all the buttons after a response
              var btns = document.querySelectorAll(
                ".jspsych-image-button-response-button button"
              );
            display_element.querySelector("#prompt").innerHTML = prompt;
            if (trial.confidence_slider){
              conf_slider.value = 5;
            }
            btns[0].innerHTML = "Red";
            btns[1].innerHTML = "Green";
            run_segmentation_check = false;
            return;
          }
        }

        end_trial(null);
      }

      // function to end trial when it is time
      const end_trial = (choice) => {
        // kill any remaining setTimeout handlers
        this.jsPsych.pluginAPI.clearAllTimeouts();
        // gather the data to store for the trial
        if (segmentation_response == 0) {
          depth_response = choice;
            if (trial.correct_depth != null) {
                depth_correct = trial.correct_depth == depth_response;
            }

          if (trial.debug){
            console.log("Correct depth answer: ", trial.correct_depth);
            console.log("Participant depth response: ", depth_response);
            console.log("Participant depth correct:" , depth_correct);
          }
          if (trial.practice_trial && trial.collect_depth_data) {
            if (!depth_correct) {
              var prompt = "No! The other color probe is actually closer. Please click the correct response to continue."
              display_element.querySelector("#prompt").innerHTML = prompt;
              return
            }
          }

          if (trial.confidence_slider) {
            depth_confidence = document.getElementById("#confidence-slider").value;
          }
        }

        var btns = document.querySelectorAll(
          ".jspsych-image-button-response-button button"
        );
        for (var i = 0; i < btns.length; i++) {
          //btns[i].removeEventListener('click');
          btns[i].setAttribute("disabled", "disabled");
        }
        var trial_data = {
          rt: response.rt,
          index: trial.index,
          stimulus: trial.stimulus,
          segmentation_response: parseInt(segmentation_response),
          depth_response: parseInt(depth_response),
          segmentation_correct: segmentation_correct,
          depth_correct: depth_correct,
          segmentation_confidence: segmentation_confidence,
          depth_confidence: depth_confidence,
          probe_locations: trial.probe_locations,
          true_segmentation: trial.correct_segmentation,
          true_depth: trial.correct_depth,
          viewing_time: trial.viewing_time,
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
        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        display_element.querySelector(
          "#jspsych-image-button-response-stimulus"
        ).className += " responded";
        // disable all the buttons after a response
        var btns = document.querySelectorAll(
          ".jspsych-image-button-response-button button"
        );

        if (run_segmentation_check) {
          var end_time = performance.now();
          var rt = Math.round(end_time - start_time);
          response.rt = rt;
          check_segmentation_response(choice);
        } else {
          var end_time = performance.now();
          var rt = Math.round(end_time - start_time);
          response.rt = rt;
          end_trial(choice);
        }

      }
    }
  }
  ImageButtonResponsePlugin.info = info;

  return ImageButtonResponsePlugin;
})(jsPsychModule);
