var app = {
    lockObj: {},
    questionFilename: "",
    eventHandler: function () {
        $("#questions-file").change(this.readSingleFile.bind(this));
    },
    init: function () {
        console.log("questions init");
        $(".nav-questions>a").addClass("active");
        this.eventHandler();
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        let inputId = e.target.id;
        if (!file) {
            return;
        }
        this.questionFilename = file.name;
        this.updateTitle();
        var reader = new FileReader();
        reader.onerror = function () {
            alert(`cannot read input file ${file.name}`)
        };
        reader.onload = function (e) {
            var contents = e.target.result;
            let jsonData = jsyaml.load(contents);
            app.lockObj = jsonData;
            localStorage.setItem("lockObj", contents);
            $("#results").html("");
            (app.create.bind(app))();
        };
        reader.readAsText(file); // TODO Fix this also
    },
    updateTitle: function () {
        $("title").text(`Questions - ${this.questionFilename}`);
    },
    create: function () {
        console.log(`Reading ${app.questionFilename}`);
        $("#results").html("SOMETHING HERE!");
    }
};

$(document).ready(app.init.bind(app));