var pointBoard = {
    lockObj: {},
    marksList: [1],
    init: function () {
        console.log("point board init");
        this.eventHandler();
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile.bind(this));
        $("#create-board").click(this.create.bind(this));
    },
    create: function () {
        console.log("this.marksList: ");
        console.log(this);
        let txt = "";
        txt += "<ul>";
        this.lockObj.answers.forEach(element => {
            txt += "<li>";
            txt+=`${element.student}`
            txt+=`
            <form>
            <input type="text" id="lock-input" />
            </form>`;
            txt += "</li>";
        });
        txt += "</ul>";
        $("#results").html(txt);

        // this.marksList = [];
        // this.responseObj.answers.forEach(element => {
        //     lockStudent = this.lockObj.answers.find((ans) => {
        //         return ans.student == element.student;
        //     });
        //     let studentMark = 0;
        //     element.itemList.map((item, idx) => {
        //         item.evaluation.responseAnswer === lockStudent.itemList[idx].evaluation.correctAnswerId ?
        //             studentMark += 1 : studentMark += 0;
        //     });
        //     studentMarkObj = { student: element.student, mark: studentMark };
        //     this.marksList.push(studentMarkObj);
        // });
        // this.writeMarkList();
    },
    // writeMarkList() {
    //     console.log(this.marksList);
    //     let txt = "";
    //     txt += "<ul>";
    //     this.marksList.forEach((element) => {
    //         txt += `<li>${element.student}: ${element.mark}</li>`;
    //     });
    //     txt += "</ul>";
    //     $("#results").html(txt);
    // },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        let inputId = e.target.id;
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            pointBoard.lockObj = JSON.parse(contents);
            console.log("lock:");
            //console.log(this);
        };
        reader.readAsText(file);
    },
}

$(document).ready(pointBoard.init.bind(pointBoard));
