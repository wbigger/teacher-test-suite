var app = {
    lockObj: {},
    studentFilename: "",
    eventHandler: function () {
        $("#students-file").change(this.readSingleFile.bind(this));
    },
    init: function () {
        console.log("students init");
        $(".nav-students>a").addClass("active");
        this.eventHandler();
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        let inputId = e.target.id;
        if (!file) {
            return;
        }
        this.studentFilename = file.name;
        this.updateTitle();
        var reader = new FileReader();
        reader.onerror = function () {
            alert(`cannot read input file ${file.name}`)
        };
        reader.onload = function (e) {
            var contents = e.target.result;
            let jsonData = JSON.parse(contents);
            app.lockObj = jsonData;
            localStorage.setItem("lockObj", contents);
            $("#results").html("");
            (app.create.bind(app))();
        };
        reader.readAsText(file); // TODO Fix this also
    },
    updateTitle: function () {
        $("title").text(`students - ${this.studentFilename}`);
    },
    create: function () {
        console.log(`Reading ${app.studentFilename}`);
        $("#results").html("SOMETHING HERE!");
    }
};

$(document).ready(app.init.bind(app));