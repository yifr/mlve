var constructTrial = (experiment_type, domain, batch, index) => {
  const promise = new Promise(function () {
    $.ajax({
      type: "POST",
      url: "/get_trial_data",
      data: {
        experiment: "detection",
        domain: "static",
        batch: 0,
        index: index,
      },
      dataType: "json",
      success: function (data) {
        const trial = {
          type: "probe-detection-task",
          stimulus: data[0].image_url,
          probe_location: data[0].probe_location,
          probe_touching: data[0].probe_touching,
          bounding_box: data[0].bounding_box,
        };
        return trial;
      },
    });
  }).then((trial) => {
    return trial;
  });
  return promise;
};
