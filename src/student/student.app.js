var studentApp = {
    students: [],
    currentClass: "2binf",
    studentData: "",
    init: function () {
        $("#nav-container").load("../index.html #nav-container>nav");
        this.studentData = `../api/students/${this.currentClass}.json`;
        this.eventHandler();
        this.loadStudents();
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
        $.getJSON(this.studentData)
            .done(this.onStudentsSuccess.bind(this))
            .fail(this.onError);
    },
    onStudentsSuccess: function (jsonData) {
        console.log(jsonData);
        this.students = jsonData.studentList;
        this.writeStudents();
    },
    // Generic error
    onError: function (e) {
        console.log("Error getting student data");
        console.log(e);
    },

    // Write students
    writeStudents: function () {
        let txt = "";
        //console.log(students.length);
        for (i = 0; i < this.students.length; i++) {
            txt += `<li data-id="` + i + `"><span>` + this.students[i].name + `</span>:<span>` + this.students[i].seed + `</span></li>`;
        }
        $("#student-list").html(txt);
    },
};

$(document).ready(studentApp.init.bind(studentApp));