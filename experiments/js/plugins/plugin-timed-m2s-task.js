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
        pretty_name: "Which option is correct",
        default: undefined,
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
        pretty_name: "Stimulus duration of main sample",
        default: null,
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
      const plugin = this;

      // Create container div
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      display_element.appendChild(container);

      // Create fixation cross
      const fixation = document.createElement('div');
      fixation.style.fontSize = '48px';
      fixation.innerHTML = '+';
      container.appendChild(fixation);

      // Create canvas element for stimulus
      const canvas = document.createElement('canvas');
      canvas.width = trial.stimulus_width;
      canvas.height = trial.stimulus_height;
      container.appendChild(canvas);

      // Draw the stimulus on the canvas
      const ctx = canvas.getContext('2d');
      const stimulusImage = new Image();
      stimulusImage.src = trial.stimulus;
      stimulusImage.onload = function () {
        ctx.drawImage(stimulusImage, 0, 0);
      };

      // Record start time
      const startTime = performance.now();


      // Timeout for stimulus presentation
      setTimeout(function () {
        fixation.style.display = 'none';
        canvas.style.display = 'none';

        // Create container for choice stimuli
        const choiceContainer = document.createElement('div');
        choiceContainer.style.display = 'flex';
        choiceContainer.style.justifyContent = 'center';
        display_element.appendChild(choiceContainer);

        // Create canvas elements for choice stimuli
        trial.choices.forEach((choice) => {
          const choiceCanvas = document.createElement('canvas');
          choiceCanvas.width = trial.choice_width;
          choiceCanvas.height = trial.choice_height;
          choiceCanvas.style.margin = '10px';
          choiceContainer.appendChild(choiceCanvas);

          const choiceCtx = choiceCanvas.getContext('2d');
          const choiceImage = new Image();
          choiceImage.src = choice;
          choiceImage.onload = function () {
            choiceCtx.drawImage(choiceImage, 0, 0);
          };
        });

        // Timeout for choice stimuli presentation
        setTimeout(function () {
          // Mask out choice stimuli
          choiceContainer.style.display = 'none';

          // Log response on click
          trial.choices.forEach((choice, index) => {
            const choiceCanvas = choiceContainer.children[index];
            choiceCanvas.addEventListener('click', function () {
              const response = {
                rt: performance.now() - startTime,
                choice: index,
                correct: index === trial.correct_choice,
              };

              plugin.jsPsych.finishTrial(response);
            });
          });
        }, trial.choice_duration);
      }, trial.stimulus_duration);
    }

  }
  ImageButtonResponsePlugin.info = info;

  return ImageButtonResponsePlugin;
})(jsPsychModule);
