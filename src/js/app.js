var app = {
    questions: [],
    students: [],
    init: function(){
        $("#test").html("caricamento domande...");
        app.eventHandler();
        app.loadQuestions();
        app.loadStudents();
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
        $("#questions").html(JSON.stringify(jsonData));
    },
    // Students
    loadStudents: function() {
        $.getJSON( "api/students/2binf.json")
        .done(app.onStudentsSuccess)
        .fail(app.onError);
    },
    onStudentsSuccess: function(jsonData) {
        console.log(jsonData);
        app.writeStudents(jsonData.studentlist);
        
    },
    // Generic error
    onError: function(e) {
        console.log(e);
    },

    // Write students
    writeStudents: function(data) {
        let txt = "";
        console.log(data.length);
        for (i=0; i<data.length;i++) {
            txt+=`<li data-id="`+i+`"><span>`+data[i].name+`</span>:<span>`+data[i].seed+`</span></li>`;
        }
        $("#student-list").html(txt);
    }
};

$(document).ready(app.init);