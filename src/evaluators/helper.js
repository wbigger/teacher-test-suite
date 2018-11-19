var helper = {
    init: function () {
        console.log("helper init");
        $("#file-input").change(helper.readSingleFile);

    },

    convertMarks2Json: function (marks) {
        console.log(marks);
        let reg = /^([A-Za-z]+)/g;
        let match;
        while (match = reg.exec(marks)) {
            console.log(match);
        }
    },
    readSingleFile: function (e) {
        var file = e.target.files[0];
        console.log(file);
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            helper.convertMarks2Json(contents);
            helper.displayContents(contents);
        };
        reader.readAsText(file);
    },

    displayContents: function (contents) {
        var element = document.getElementById('file-content');
        element.textContent = contents;
    }
}



$(document).ready(helper.init);
