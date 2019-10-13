var app = {
    lockObj: {},
    lockFilename: "",
    init: function () {
        console.log("stats init");
        $("#nav-container").load("../index.html #nav-container>nav");
        this.eventHandler();
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile).bind(this);
    },
    stats: function () {

        
    },
    
    updateTitle: function() {
        $("title").text(`stats-${this.lockFilename}`);
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        let inputId = e.target.id;
        if (!file) {
            return;
        }
        app.lockFilename = file.name;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            app.lockObj = JSON.parse(contents);
            (app.updateTitle.bind(app))();
            (app.stats.bind(app))();
        };
        reader.readAsText(file);
    },
}

$(document).ready(app.init.bind(app));
