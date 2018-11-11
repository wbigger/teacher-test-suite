var app = {
    questions: [],
    students: [],
    init: function(){
        $("#test").html("caricamento domande...");
        app.eventHandler();
        app.loadQuestions();
    },
    eventHandler: function() {
        $("#student-list li").on('click', function() {
            //  ret = DetailsView.GetProject($(this).attr("#data-id"), OnComplete, OnTimeOut, OnError);
            alert($(this).attr("#data-id"));
          });
    },
    // Questions
    loadQuestions: function() {
        $.getJSON( "api/questions/questions.json")
        .done(app.onQuestionsSuccess)
        .fail(app.onError);
    },
    onQuestionsSuccess: function(jsonData) {
        console.log(jsonData);
        app.questions = jsonData.questionlist;
        app.writeQuestions();
        app.loadStudents();
    },
    // Students
    loadStudents: function() {
        $.getJSON( "api/students/2binf.json")
        .done(app.onStudentsSuccess)
        .fail(app.onError);
    },
    onStudentsSuccess: function(jsonData) {
        console.log(jsonData);
        app.students = jsonData.studentlist;
        app.writeStudents();
        app.composeQuestions();
    },
    // Generic error
    onError: function(e) {
        console.log(e);
    },

    // Write questions
    writeQuestions: function() {
        let txt = "";
        //console.log(questions.length);
        for (i=0; i<app.questions.length;i++) {
            txt+=`<li data-id="`+i+`"><span>`+app.questions[i].name+`</span></li>`;
        }
        $("#questions").html(txt);
    },

    // Write students
    writeStudents: function() {
        let txt = "";
        //console.log(students.length);
        for (i=0; i<app.students.length;i++) {
            txt+=`<li data-id="`+i+`"><span>`+app.students[i].name+`</span>:<span>`+app.students[i].seed+`</span></li>`;
        }
        $("#student-list").html(txt);
    },
    

    composeQuestions: function() {
        console.log("compose questions");
        var question = app.questions[0];
         app.students.forEach(element => {
            let q = composer.create(question,element.seed);
            console.log(q);
         });
        
    }
};

$(document).ready(app.init);