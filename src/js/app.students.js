var appStudents = {
    students: [],
    init: function () {
        appStudents.eventHandler();
        appStudents.loadStudents();
    },
    eventHandler: function() {
        $("#student-list li").on('click', function() {
            //  ret = DetailsView.GetProject($(this).attr("#data-id"), OnComplete, OnTimeOut, OnError);
            console.log("ciao");
            alert($(this).attr("#data-id"));
          });
    },
    // Students
    loadStudents: function () {
        $.getJSON("api/students/2binf.json")
            .done(appStudents.onStudentsSuccess)
            .fail(appStudents.onError);
    },
    onStudentsSuccess: function (jsonData) {
        console.log(jsonData);
        appStudents.students = jsonData.studentlist;
        appStudents.writeStudents();
    },
    // Generic error
    onError: function (e) {
        console.log(e);
    },

    // Write students
    writeStudents: function () {
        let txt = "";
        //console.log(students.length);
        for (i = 0; i < appStudents.students.length; i++) {
            txt += `<li data-id="` + i + `"><span>` + appStudents.students[i].name + `</span>:<span>` + appStudents.students[i].seed + `</span></li>`;
        }
        $("#student-list").html(txt);
    },
};

$(document).ready(appStudents.init);