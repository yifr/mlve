# Experiment Setup

1. Generate json configs that contain all the relevant 
metadata + trial info (do this on OpenMind). Data should be stored 
in: 
	experiments/configs/<experiment_name>/batch_{i}.json
2. Push data to github
3. Pull from webserver
4. Run script to store them in mongo with the following format:
	db=projName
	col=expName + "_inputs"
	
