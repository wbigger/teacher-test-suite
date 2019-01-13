var app = {
    classworkURL: undefined,
    studentsURL: undefined,
    itemList: [],
    students: [],
    className: undefined,
    subject: undefined,
    lockList: [],
    init: function () {
        app.eventHandler();
        if (typeof test !== "undefined") {
            app.classworkURL = test.classworkURL;
            app.studentsURL = test.studentsURL;
            console.log("Using test values");
            console.log("- class: " + app.studentsURL)
            console.log("- classwork: " + app.classworkURL)
        } else {
            console.log("please select students and classwork");
        }
        //app.loadQuestions();
    },
    eventHandler: function () {
        $("#class-select").val("default");
        $("#class-select").change(() => {
            let str = "";
            $("#class-select option:selected").each(function () {
                str += $(this).val();
            });
            app.studentsURL = "../api/students/" + str + ".json";
        });
        $("#classwork-select").val("default");
        $("#classwork-select").change((el) => {
            let str = "";
            $("#classwork-select option:selected").each(function () {
                str += $(this).val();
            });
            app.classworkURL = "../api/classworks/" + str + ".json";
        });

        $("#create-button").click(() => {
            console.log("class: " + app.studentsURL)
            console.log("classwork: " + app.classworkURL)
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
        console.log("onStudentSuccess");
        console.log(jsonData);
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
        let data = JSON.stringify({answers:app.lockList});
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
        console.log("compose itemList");
        var itemList = app.itemList;
        let txt = "";
        app.students.forEach(student => {
            let ret = composer.create(itemList, student, app.className, app.subject);
            txt += ret[0];
            app.lockList.push({ student: student, itemList: ret[1] });
        });
        
        $("#classworks").html(txt);

    }
};

$(document).ready(app.init);