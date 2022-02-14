## Stimulus sets in mongo

By default, a complete list of stimuli is provided in with each experiment config. However, for experiments in which different participants need to see a different subset of stimuli, it can be helpful to store batches of these stimuli somewhere, then read these in.

### Uploading: partition stimuli into batches => mongo

For prior_elicitation, this is handled in the CA repo.
@will will move it to lax

Upload to dbname: `stimuli`, in any collection.
These are designed to be temporary. Use a single collection for a single experiment, and update your config as described below.

The basic idea is that a single entry in your collection should include all info needed to run one batch (e.g. a list of stimuli, plus info about those stims)

### Downloading: stimulus batches from mongo => experiment

We assume that stimuli are in the mongo instance where data are being stored, but in a database called `stimuli`.
Stimulus loading is triggered when `stimColName` has been set to a value in config.
  
  NOTE: This currently bypasses functions for handling separate trial types- ideally we will combine these functions in the future, but for now stim loading from mongo is only possible when there is a single block of trials of the same type.

Stimulus metadata is downloaded in `getStimListFromMongo`, in `experimentSetup.js`. It emits a `getStim` message to mongo, triggering app.js to fetch the mongo entry with the smallest number of entries in the `games` column.

Downloaded metadata is also appended to the data collection, which serves as a double-check that downloaded stims are the ones we expect.

### Before actually running an experiment that uses this:

- DELETE AND REUPLOAD METADATA
  - The number of times each batch has been marked is incremented each time it is uploaded. Best practice is to (carefully) drop the collection, then reupload the whole thing.
- Ensure stimColName is correct
- Update iterationName
- Remember that metadata counts change when people do the experiment- if you want to run e.g. two versions of the same study it is safest to use separate collections named something sensible e.g. `stims_thisOption` `stims_thatOption`, even if the metadata stored in them is initially the same.