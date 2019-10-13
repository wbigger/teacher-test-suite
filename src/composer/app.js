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
    info: undefined,

    lockList: [],
    init: function () {
        $("#nav-container").load("../index.html #nav-container>nav");
        // Load classworks list
        $.getJSON(app.apiPath + "classworks.json")
            .done(app.onClassworkSuccess)
            .fail(app.onError);
        // Load student classes list
        $.getJSON(app.apiPath + "students.json")
            .done(app.onStudentSuccess)
            .fail(app.onError);
        app.eventHandler();
    },
    loadTestValues: function () {
        if (typeof test !== "undefined") {
            app.classworkID = test.classworkID;
            app.studentsID = test.studentsID;
            console.log("Loading test values:");
            console.log("- students: " + app.studentsID)
            console.log("- classwork: " + app.classworkID)
            app.classworkURL = app.apiPath + "classworks/" + app.classworkID + ".json";
            app.studentsURL = app.apiPath + "students/" + app.studentsID + ".json";
            if (typeof app.studentsID !== "undefined") {
                $("#class-select").val(app.studentsID);
            }
            if (typeof app.classworkID !== "undefined") {
                $("#classwork-select").val(app.classworkID);
            }
        } else {
            console.log("please select students and classwork");
        }
    },
    onClassworkSuccess: function (jsonData) {
        jsonData.classworks.forEach((classwork) => {
            let opt = $("<option>")
                .attr("value", classwork.value)
                .html(classwork.name);
            $("#classwork-select").append(opt);
        }
        );
        app.loadTestValues();
    },
    onStudentSuccess: function (jsonData) {
        jsonData.studentClasses.forEach((studentClass) => {
            let opt = $("<option>")
                .attr("value", studentClass.value)
                .html(studentClass.name);
            $("#class-select").append(opt);
        }
        );
        app.loadTestValues();
    },
    eventHandler: function () {
        $("#class-select").change(() => {
            let str = "";
            $("#class-select option:selected").each(function () {
                str += $(this).val();
            });
            app.studentsURL = app.apiPath + "students/" + str + ".json";
        });
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
                $("#classworks").html("");
                app.loadQuestions();
            } else {
                alert("Please select class and classwork");
            }
            $("#show-correct").prop('checked', false);
        });
        $("#show-correct").click((e) => {
            let isChecked = e.target.checked;
            if (isChecked) {
                $(".correct-answer").addClass("highlight");
                $(".open-answer-hint").addClass("show-hint");
                $(".hr").addClass("hide");
            } else {
                $(".correct-answer").removeClass("highlight");
                $(".open-answer-hint").removeClass("show-hint");
                $(".hr").removeClass("hide");
            }
            app.updateTitle();
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
        app.info = jsonData.info;
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
        app.updateTitle();
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
            classworks: app.lockList,
            className: app.className,
            subject: app.subject,
            info: app.info,
            numberOfQuestions:app.itemList.length // FIXME: how to know array length?
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
        // Save also to local storage
        localStorage.setItem("lockObj", data);
    },
    updateTitle: function () {
        $("title").text(`${app.className}-${app.subject}`);
        if ($("#show-correct")[0].checked) {
            $("title").append("-correttore")
        }
    },
    composeQuestions: function () {

        app.students.forEach(student => {
            var itemList = app.itemList.slice(); // copy values
            let ret = composer.create(itemList, student, app.className, app.subject, app.info);
            $("#classworks").append(ret[0]);
            app.lockList.push({ student: student, itemList: ret[1] });
        });
    }
};

$(document).ready(app.init);