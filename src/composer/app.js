var app = {
    apiPath: "../api/",
    classworkID: "default",
    studentsID: "default",
    classworkURL: undefined,
    studentsURL: undefined,
    itemList: [],
    students: [],
    className: undefined,
    subject: undefined,
    lockList: [],
    init: function () {
        if (typeof test !== "undefined") {
            app.classworkID = test.classworkID;
            app.studentsID = test.studentsID;
            console.log("Loading test values:");
            console.log("- students: " + app.studentsID)
            console.log("- classwork: " + app.classworkID)
            app.classworkURL = app.apiPath + "classworks/" + app.classworkID + ".json";
            app.studentsURL = app.apiPath + "students/" + app.studentsID + ".json";
        } else {
            console.log("please select students and classwork");
        }
        app.eventHandler();
    },
    eventHandler: function () {
        $("#class-select").val(app.studentsID);
        $("#class-select").change(() => {
            let str = "";
            $("#class-select option:selected").each(function () {
                str += $(this).val();
            });
            app.studentsURL = app.apiPath + "students/" + str + ".json";
        });
        $("#classwork-select").val(app.classworkID);
        $("#classwork-select").change((el) => {
            let str = "";
            $("#classwork-select option:selected").each(function () {
                str += $(this).val();
            });
            app.classworkURL = app.apiPath + "classworks/" + str + ".json";
        });

        $("#create-button").click(() => {
            console.log("using class: " + app.studentsURL)
            console.log("using classwork: " + app.classworkURL)
            if (app.studentsURL && app.classworkURL) {
                app.loadQuestions();
            } else {
                alert("Please select class and classwork");
            }
        });
        $("#save-button").click(() => {
            app.saveToFile();
        });
    },
    // Questions
    loadQuestions: function () {
        $.getJSON(app.classworkURL)
            .done(app.onQuestionsSuccess)
            .fail(app.onError);
    },
    onQuestionsSuccess: function (jsonData) {
        app.itemList = jsonData.itemList;
        app.subject = jsonData.subject;
        app.loadStudents();
    },
    // Students
    loadStudents: function () {
        $.getJSON(app.studentsURL)
            .done(app.onStudentsSuccess)
            .fail(app.onError);
    },
    onStudentsSuccess: function (jsonData) {
        app.students = jsonData.studentList;
        app.className = jsonData.className;
        app.composeQuestions();
    },
    // Generic error
    onError: function (e) {
        console.log("onError!");
        console.log("class: " + app.studentsURL)
        console.log("classwork: " + app.classworkURL)
        console.log(e);
    },
    saveToFile: function () { //TODO: do not replicate, there is this function also in helper
        let data = JSON.stringify({
            classworks:app.lockList,
            className: app.className,
            subject: app.subject
        });
        let filename = `lock-${app.className}-${app.subject}.json`;
        let type = "application/json";
        console.log(`Saving file: ${filename}`); // use string template :)
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
    composeQuestions: function () {
        let txt = "";
        app.students.forEach(student => {
            var itemList = app.itemList.slice(); // copy values
            let ret = composer.create(itemList, student, app.className, app.subject);
            txt += ret[0];
            app.lockList.push({ student: student, itemList: ret[1] });
        });
        
        $("#classworks").html(txt);

    }
};

$(document).ready(app.init);