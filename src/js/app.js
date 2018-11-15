var app = {
    testURL: "test-repository/quiz/questions.json",
    studentsURL: "api/students/3ainf.json",
    questions: [],
    students: [],
    init: function () {
        $("#students").hide();
        app.eventHandler();
        app.loadQuestions();
    },
    eventHandler: function () {
        $("#student-list li").on('click', function () {
            //  ret = DetailsView.GetProject($(this).attr("#data-id"), OnComplete, OnTimeOut, OnError);
            alert($(this).attr("#data-id"));
        });
    },
    // Questions
    loadQuestions: function () {
        $.getJSON(app.testURL)
            .done(app.onQuestionsSuccess)
            .fail(app.onError);
    },
    onQuestionsSuccess: function (jsonData) {
        //console.log(jsonData);
        app.questions = jsonData.itemList;
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
        app.students = jsonData.studentlist;
        app.writeStudents();
        app.composeQuestions();
    },
    // Generic error
    onError: function (e) {
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
        //console.log("compose questions");
        var questions = app.questions;
        let txt = "";
        app.students.forEach(student => {
            let q = composer.create(questions, student);
            txt += q;
        });
        $("#classworks").html(txt);

    }
};

$(document).ready(app.init);