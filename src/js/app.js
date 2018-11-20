var app = {
    classworkURL: undefined,
    studentsURL: undefined,
    questions: [],
    students: [],
    className: undefined,
    subject: undefined,
    init: function () {
        app.eventHandler();
        if (typeof test !== "undefined") {
            app.classworkURL = test.classworkURL;
            app.studentsURL = test.studentsURL;
            console.log("using test value");
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
            app.studentsURL = "api/students/" + str + ".json";
        });
        $("#classwork-select").val("default");
        $("#classwork-select").change((el) => {
            let str = "";
            $("#classwork-select option:selected").each(function () {
                str += $(this).val();
            });
            app.classworkURL = "api/classworks/" + str + ".json";
        });

        $("#create-button").click(() => {
            if (app.studentsURL && app.classworkURL) {
                console.log("class: " + app.studentsURL)
                console.log("classwork: " + app.classworkURL)
                app.loadQuestions();
            } else {
                console.log("class: " + app.studentsURL)
                console.log("classwork: " + app.classworkURL)
                alert("Please select class and classwork");
            }
        });
    },
    // Questions
    loadQuestions: function () {
        $.getJSON(app.classworkURL)
            .done(app.onQuestionsSuccess)
            .fail(app.onError);
    },
    onQuestionsSuccess: function (jsonData) {
        app.questions = jsonData.itemList;
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

    composeQuestions: function () {
        console.log("compose questions");
        var questions = app.questions;
        let txt = "";
        app.students.forEach(student => {
            let q = composer.create(questions, student,app.className,app.subject);
            txt += q;
        });
        $("#classworks").html(txt);

    }
};

$(document).ready(app.init);