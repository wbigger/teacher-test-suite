var helper = {
    answerObj: [],
    init: function () {
        console.log("helper init");
        helper.eventHandler();
    },
    eventHandler: function () {
        $("#file-input").change(helper.readSingleFile);
        $("#save-content").click(helper.saveToFile);
    },
    convertAnswer2Json: function (answers) {
        let reg = new RegExp("^([A-Za-z ]+) ([0-9 ]+)+", "gm");
        let match;
        while (match = reg.exec(answers)) {
            let itemList = [];
            let studentName = match[1].trim();
            // get the student name
            // eliminate whitespace
            let answerText = match[2].replace(/ /g, '');
            // use spread operator to convert string in array of char
            [...answerText].forEach(c => {
                let item = {};
                item.evaluation = {};
                item.evaluation.correctAnswer = c;
                itemList.push(item);
            });
            helper.answerObj.push({ student: studentName, itemList });
        }
        console.log(helper.answerObj);
    },
    saveToFile: function () {
        let data = JSON.stringify({answers:helper.answerObj});
        let filename = "results.json";
        let type = "application/json";
        // from stackoverflow
        var file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        console.log(file);
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            helper.convertAnswer2Json(contents);
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
