
async function getExperimentData(imageURL, experiment) {
    // Get data from server for this image URL
    const response = await fetch(`/get_experiment_data?` 
                + new URLSearchParams({imageURL: imageURL, experiment: experiment}))
    return response.json();
}

function loadExperimentData(modal, imageURL, experiment_name){
    getExperimentData(imageURL, experiment_name).then(function(data) {
        /* Visualize data */
        data = data["data"]
        console.log(data)
    })
}

function populateVisModal(modal_id, imageURL) {
    var modal = $(modal_id);
    getExperimentOpts(imageURL).then(function(data) {
       /* populate list of experiments with data */
       var experiment_opts = data["data"];
       var experiment_list = modal.find(".experiment-list"); 
       for (var i = 0; i < experiment_opts.length; i++) {
            // Add a new line to the list with experiment name
            var experiment_name = experiment_opts[i]
            var new_line = (`<a class='dropdown-item' onclick='loadExperimentData(${modal}, ${imageURL}, ${experiment_name})'>` + experiment_name + "</a>");
            // Insert html for list item
            experiment_list.append(new_line);
       }
    });
}

async function getExperimentOpts(imageURL) {
    // Get data from server for this image URL
    const response = await fetch(`/get_experiment_opts?` 
                + new URLSearchParams({imageURL: imageURL}))
    return response.json();
}

$(document).ready(function() {
    function filterImages(dataset) {
        console.log("Filtering dataset: " + dataset)
        images = $(".dataset-image");
        for (var i = 0; i < images.length; i++) {
            var image_id = images[i].id;
            if (image_id.includes(dataset)) {
                images[i].style.display = "block";
            } else {
                images[i].style.display = "none";
            }
        }
    }

    function updateCurrentDataset(dataset) {
        dataset_text = $("#currentDataset");
        dataset_text.text(dataset);
    }

    var current_dataset = "nsd";
    updateCurrentDataset("NSD")
    filterImages(current_dataset);
    
    $(".dataset-option").on("click", function() {
        var selected = $(this).text()
        updateCurrentDataset(selected)
        dataset = selected.toLowerCase();
        filterImages(dataset)
        current_dataset = selected;
    });
})