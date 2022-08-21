var objectLocalizationTask = (function (jspsych) {
  "use strict";

  const info = {
    name: "object-localization-task",
    parameters: {
      /** The image to be displayed */
      stimulus: {
        type: jspsych.ParameterType.IMAGE,
        pretty_name: "Stimulus",
        default: undefined,
      },
      probe_location: {
        type: jspsych.ParameterType.Array,
        pretty_name: "Probe Location",
        default: undefined,
      },
      probe_touching: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Whether probe is touching object",
        default: false,
      },
      gt_bounding_box: {
        type: jspsych.ParameterType.Array,
        pretty_name: "Ground Truth Bounding Box",
        default: [],
      },
      practice_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Instructions",
        default: false,
      },
      probe_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Probe duration",
        default: -1,
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
      /** Maintain the aspect ratio after setting width or height */
      maintain_aspect_ratio: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Maintain aspect ratio",
        default: true,
      },
      /** Array containing the label(s) for the button(s). */
      choices: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Choices",
        default: ["Yes", "No"],
        array: true,
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
        default: "Is the center of the dot touching an object?",
      },
      /** How long to show the stimulus. */
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Stimulus duration",
        default: null,
      },
      /** How long to show the trial. */
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Trial duration",
        default: null,
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
      debug: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Debug",
        default: false,
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
    },
  };
  /**
   * **image-button-response**
   *
   * jsPsych plugin for displaying an image stimulus with a probe location and getting a button response
   *
   * @author Yoni Friedman
   */

  /* Bounding Box utilities */
  // Usage: initDraw(document.getElementById('canvas'));

  class objectLocalizationTaskPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      var height, width;
      var html;
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
        document.body.style.backgroundColor = "#fff";
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

          function drawProbe(ctx) {
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(img, 0, 0, width, height);

            // Draw outer probe on canvas
            ctx.beginPath();
            var x = parseInt(trial.probe_location[0]);
            var y = parseInt(trial.probe_location[1]);
            var radius = 12;
            var startAngle = 0; // Starting point on circle
            var endAngle = 2 * Math.Pi; // End point on circle
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(70, 50, 100, 0.75)";
            ctx.fill();

            // Draw inner probe on canvas
            ctx.beginPath();
            var x = parseInt(trial.probe_location[0]);
            var y = parseInt(trial.probe_location[1]);
            var radius = 4;
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 6, 0, 1)";
            ctx.fill();
            return ctx;
          }

          function clearProbe(ctx) {
            // Create transparent circle at probe point
            var x = parseInt(trial.probe_location[0]);
            var y = parseInt(trial.probe_location[1]);
            var radius = 12;
            ctx.globalCompositeOperation = "destination-out";
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
          }

          function flashProbe(ctx) {
            drawProbe(ctx);
            setTimeout(function () {
              clearProbe(ctx);
            }, 200);
            setTimeout(function () {
              drawProbe(ctx);
            }, 400);
            setTimeout(function () {
              clearProbe(ctx);
            }, 600);
            setTimeout(function () {
              drawProbe(ctx);
            }, 800);
            //setTimeout(drawProbe(ctx), 400);
          }
          flashProbe(ctx);
        };

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

        // var canvasOffset = canvas.offset();
        var bounding_box_drawn = false;
        var startX;
        var startY;
        var endX;
        var endY;

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
          display_element.insertAdjacentHTML(
            "beforeend",
            "<p class='unselectable' unselectable='on' id='prompt'>" +
              trial.prompt +
              "</p>"
          );

          if (trial.practice_trial) {
            var title = document.createElement("h3");
            title.innerHTML = "Practice Trial";
            display_element.insertBefore(title, canvas);
          }
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
        if (trial.debug) {
          console.log(
            "correct: ",
            (response.button == 0) == trial.probe_touching
          );
        }
        // gather the data to store for the trial
        if (bounding_box_drawn) {
          var subject_bounding_box = [
            [startX, startY],
            [endX, endY],
          ];
        } else {
          var subject_bounding_box = [];
        }

        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.button,
          correct: (response.button == 0) == trial.probe_touching,
          probe_location: trial.probe_location,
          probe_touching: trial.probe_touching,
          subject_bounding_box: subject_bounding_box,
          gt_bounding_box: trial.gt_bounding_box,
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

        const initBoundingBox = () => {
          canvas.style.cursor = "crosshair";

          function updateCanvas() {
            var img = new Image();
            img.src = trial.stimulus;

            // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
            ctx.drawImage(
              img,
              0,
              0,
              trial.stimulus_height,
              trial.stimulus_width
            );

            if (trial.practice_trial) {
              // Draw ground truth bounding box
              ctx.beginPath();
              ctx.lineWidth = 5;
              ctx.strokeStyle = "rgba(0, 6, 255, 1)";

              var gt_bounding_box = trial.gt_bounding_box;

              var gt_x0 = gt_bounding_box[0][0];
              var gt_y0 = gt_bounding_box[0][1];
              var gt_x1 = gt_bounding_box[1][0];
              var gt_y1 = gt_bounding_box[1][1];
              var gt_width = gt_x1 - gt_x0;
              var gt_height = gt_y1 - gt_y0;

              ctx.strokeRect(gt_x0, gt_y0, gt_width, gt_height);
              ctx.fill();
            }

            // Draw probe on canvas
            ctx.beginPath();
            var x = parseInt(trial.probe_location[0]);
            var y = parseInt(trial.probe_location[1]);
            var radius = 12;

            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(70, 50, 100, 0.75)";
            ctx.fill();

            // Draw probe on canvas
            ctx.beginPath();
            var x = parseInt(trial.probe_location[0]);
            var y = parseInt(trial.probe_location[1]);
            var radius = 4;

            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 6, 0, 1)";
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 6, 0, 1)";
          }

          var isDrawing = false;

          function getMousePosition(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            var x = evt.clientX - rect.left;
            var y = evt.clientY - rect.top;
            return [x, y];
          }

          function handleMouseDown(e) {
            var mousePos = getMousePosition(canvas, e);
            startX = mousePos[0];
            startY = mousePos[1];

            isDrawing = true;

            canvas.style.cursor = "crosshair";
          }

          $(canvas).mousedown(function (e) {
            handleMouseDown(e);
          });

          $(canvas).mouseup(function (e) {
            var mousePos = getMousePosition(canvas, e);
            var mouseX = mousePos[0];
            var mouseY = mousePos[1];
            endX = mouseX;
            endY = mouseY;
            isDrawing = false;
            canvas.style.cursor = "crosshair";
            updateCanvas();

            // Draw Bounding Box
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 6, 0, 1)";
            ctx.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
            ctx.fill();

            if (
              Math.sqrt((endX - startX) ** 2) *
                Math.sqrt((endY - startY) ** 2) >
              25
            ) {
              bounding_box_drawn = true;
            } else {
              bounding_box_drawn = false;
            }
          });

          $(canvas).on("mousemove", function (e) {
            var mousePos = getMousePosition(canvas, e);
            var mouseX = mousePos[0];
            var mouseY = mousePos[1];

            // Put your mousedown stuff here
            if (isDrawing) {
              updateCanvas();

              // Update bounding box
              ctx.beginPath();
              ctx.lineWidth = 5;
              ctx.strokeStyle = "rgba(255, 6, 0, 1)";
              ctx.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
              ctx.fill();
            }
          });
        };

        if (trial.practice_trial) {
          if (response.button != 0 && trial.probe_touching) {
            prompt =
              "The dot is touching the object! Please press 'Yes' to continue.";
            display_element.querySelector("#prompt").innerHTML = prompt;
            return;
          } else if (response.button != 1 && !trial.probe_touching) {
            prompt =
              "In this trial the dot is not touching an object! Please press 'No' to continue.";
            display_element.querySelector("#prompt").innerHTML = prompt;
            return;
          }
        }

        if (response.button == 0 && !bounding_box_drawn) {
          var prompt = "";
          if (trial.practice_trial) {
            prompt =
              "That's the right answer! Now draw a box to match the <strong>correct</strong> box you see drawn in blue.";
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(0, 6, 255, 1)";
            var gt_bounding_box = trial.gt_bounding_box;

            var gt_x0 = gt_bounding_box[0][0];
            var gt_y0 = gt_bounding_box[0][1];
            var gt_x1 = gt_bounding_box[1][0];
            var gt_y1 = gt_bounding_box[1][1];
            var gt_width = gt_x1 - gt_x0;
            var gt_height = gt_y1 - gt_y0;

            ctx.strokeRect(gt_x0, gt_y0, gt_width, gt_height);
            ctx.fill();
          } else {
            prompt =
              "Please draw a bounding box around the object the dot is touching.";
          }
          display_element.querySelector("#prompt").innerHTML = prompt;

          initBoundingBox();

          // Swap out buttons
          display_element.querySelector(
            "#jspsych-image-button-response-btngroup"
          ).innerHTML = `<div class="jspsych-image-button-response-button"
                          style="display: inline-block; margin:0px 8px" id="jspsych-image-button-response-button-0" data-choice="0">
                            <button unselectable='on' class="jspsych-btn unselectable">Submit</button>
                        </div>`;

          display_element
            .querySelector("#jspsych-image-button-response-button-0")
            .addEventListener("click", (e) => {
              var btn_el = e.currentTarget;
              var choice = btn_el.getAttribute("data-choice"); // don't use dataset for jsdom compatibility

              if (!bounding_box_drawn) {
                display_element.querySelector("#prompt").innerHTML =
                  "Please draw a bounding box before continuing";
                return;
              }

              if (trial.practice_trial) {
                // Check bounding box area matches
                gt_bounding_box = trial.gt_bounding_box;
                var gt_x0 = gt_bounding_box[0][0];
                var gt_y0 = gt_bounding_box[0][1];
                var gt_x1 = gt_bounding_box[1][0];
                var gt_y1 = gt_bounding_box[1][1];
                var gt_area = (gt_x1 - gt_x0) * (gt_y1 - gt_y0);

                var x0 = startX;
                var x1 = endX;
                var y0 = startY;
                var y1 = endY;
                var user_area = (x1 - x0) * (y1 - y0);

                var x_left = Math.max(x0, gt_x0);
                var x_right = Math.min(x1, gt_x1);
                var y_top = Math.max(gt_y0, y0);
                var y_bottom = Math.min(gt_y1, y1);

                var intersection = (x_right - x_left) * (y_bottom - y_top);

                var iou = Math.abs(intersection / (gt_area + user_area - intersection));
                console.log(iou);
                if (iou < 0.6) {
                  display_element.querySelector("#prompt").innerHTML =
                    "To continue, please make sure your bounding box is as close as possible to the ground truth blue one.";
                  return;
                }
              }
              after_response(choice);
            });

          return;
        } else if (response.button == 0) {
          bounding_box_drawn = true;
        }

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

  objectLocalizationTaskPlugin.info = info;

  return objectLocalizationTaskPlugin;
})(jsPsychModule);
