

var app = {
    codeMirrorEditor: null,
    classworkYaml: null,
    apiPath: "../api/",
    classworkID: "default",
    studentsID: "default",
    classworkURL: undefined,
    classworkURLYaml: undefined,
    studentsURL: undefined,
    itemList: [],
    students: [],
    className: undefined,
    subject: undefined,
    info: undefined,

    lockList: [],
    init: function () {
        $("#nav-container").load("../index.html #nav-container>nav");

        // Init CodeMirror editor
        let codeTextArea = $("#yaml-code")[0];
        app.codeMirrorEditor = CodeMirror.fromTextArea(codeTextArea, {
            mode: "yaml",
            lineNumbers: true,
        });        
        // app.codeMirrorEditor.getDoc().setValue("# Hello\ntry: ok");
        app.codeMirrorEditor.getDoc().setValue(yamlPlaceholder);

        app.eventHandler();
    },
    eventHandler: function () {
        $("#save-yaml").click(() => {
            console.log("Saving YAML...");
            console.log(app.codeMirrorEditor.getOption("mode"));
            console.log(app.codeMirrorEditor.getDoc().getValue());
        });
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        console.log(file);
        if (!file) {
            return;
        }
        helper.filename = file.name;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            helper.convertName2Json(contents);
            helper.displayContents(contents);
        };
        reader.readAsText(file);
    },
    
};

$(document).ready(app.init);