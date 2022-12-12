function get_collection_names() {

    const response = fetch("/get_collection_names")
    .then(function(response) {
        data = response.json();
        console.log(data);
        return data;
    });
}

/* Functionality to build: 

1. List collection names
2. Get data from collection
3. Display data in nice clean format
*/

function get_experiment_data(col_name) {
    const response = fetch(`/get_experiment_data?` + new URLSearchParams({
        col_name: col_name}))
    .then(function(response) {
        data = response.json();
        console.log(data);
        return data;
    });
}