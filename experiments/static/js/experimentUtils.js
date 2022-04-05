function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}


function setupExperiment() { 
    // Domain 
    // Batch data? 
    // Config
    const jsPsych = initJsPsych({
        show_progress_bar: true,
        auto_update_progress_bar: true,
      });

      var urlParams = parseURLParams(window.location.href);
      
      var domain = urlParams["domain"]
      var experiment = urlParams["experiment"]

      $.ajax({
        type: "GET",
        url: "/get_trial_data",
        data: { experiment: experiment, domain: domain},
        dataType: "json",
        success: function (resp) {
          trials = [];
          var preload = {
            type: jsPsychPreload,
            auto_preload: true,
            on_start: function () {
              document.body.style.backgroundColor = "#fff";
            }
          };
          trials.push(preload);
    
          consent = {
            type: jsPsychExternalHtml,
            url: "consent.html",
            cont_btn: "start",
          }
}