var app = {
    classworkURL: undefined,
    studentsURL: undefined,
    questions: [],
    students: [],
    className: undefined,
    subject: undefined,
    init: function () {
        $("#students").hide();
        app.eventHandler();
        //app.loadQuestions();
    },
    eventHandler: function () {
        $("#student-list li").on('click', function () {
            //  ret = DetailsView.GetProject($(this).attr("#data-id"), OnComplete, OnTimeOut, OnError);
            alert($(this).attr("#data-id"));
        });
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
        //console.log(jsonData);
        app.students = jsonData.studentList;
        app.className = jsonData.className;
        app.writeStudents();
        app.composeQuestions();
    },
    // Generic error
    onError: function (e) {
        console.log("onError!");
        console.log("class: " + app.studentsURL)
        console.log("classwork: " + app.classworkURL)
        console.log(e);
    },

    // Write students
    writeStudents: function () {
        let txt = "";
        //console.log(students.length);
        for (i = 0; i < app.students.length; i++) {
            txt += `<li data-id="` + i + `"><span>` + app.students[i].name + `</span>:<span>` + app.students[i].seed + `</span></li>`;
        }
        $("#student-list").html(txt);
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