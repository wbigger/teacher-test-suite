// convert custom txt format of answers int json (legacy)
var helper = {
    contentObj: [],
    filename: "",
    init: function () {
        console.log("helper init");
        helper.eventHandler();
    },
    eventHandler: function () {
        $("#file-input").change(helper.readSingleFile);
        $("#save-student-json").click(helper.saveToFile);
    },
    // convert from txt with names of student to json
    convertName2Json: function (students) {
        let reg = new RegExp("^(.*)$", "gm");
        let match;
        while (match = reg.exec(students)) {
            let studentName = match[1].trim();            
            if (!studentName) break;
            // Take the first two capital letters as ID
            // TODO: check that the ID is actually unique
            let IDreg = new RegExp("^([A-Z]).*([A-Z])", "g");
            IDmatch = IDreg.exec(studentName);
            helper.contentObj.push({ name: studentName, id: `${IDmatch[1]}${IDmatch[2]}`});
        }
        console.log(helper.contentObj);
    },
    saveToFile: function () {
        let data = JSON.stringify({className:"Put-class-name-here (es. 1Binf)",studentList:helper.contentObj});

        let filename = helper.filename.replace("txt","json");
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
        helper.filename = file.name;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            helper.convertName2Json(contents);
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
