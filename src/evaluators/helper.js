var helper = {
    init: function () {
        console.log("helper init");
        $("#file-input").change(helper.readSingleFile);

        // test
        var myString = "something format_abc";
        var myRegexp = /format_/g;
        var match = myRegexp.exec(myString);
        console.log(match[0]); // abc
    },

    convertMarks2Json: function () {

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
