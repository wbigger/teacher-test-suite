var evaluator = {
    lockObj: {},
    marksList: [],
    init: function () {
        console.log("evaluator init");
        this.eventHandler();
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile).bind(this);
        $("#evaluate-button").click(this.evaluate.bind(this));
    },
    evaluate: function () {
        this.marksList = [];
        this.lockObj.answers.forEach(classwork => {
            let studentMark = 0;
            classwork.itemList.filter(item => item.type == "multiple-choice")
                .forEach(item => {
                    item.evaluation.responseAnswer === item.evaluation.correctAnswerId ?
                        studentMark += 1 : studentMark += 0;
                });
            classwork.itemList.filter(item => item.type == "open-answer")
                .forEach(item => {
                    item.evaluation.pointList.forEach(point => {
                        point.studentAnswer === true ?
                            studentMark += 1 : studentMark += 0;
                    });
                    studentMarkObj = { student: classwork.student, mark: studentMark };

                });
            this.marksList.push(studentMarkObj);
        });
        this.writeMarkList();
    },
    writeMarkList() {
        console.log(this.marksList);
        let txt = "";
        txt += "<ul>";
        this.marksList.forEach((element) => {
            txt += `<li>${element.student.name}: ${element.mark}</li>`;
        });
        txt += "</ul>";
        $("#results").html(txt);
    },
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
            evaluator.lockObj = JSON.parse(contents);
        };
        reader.readAsText(file);
    },
}

$(document).ready(evaluator.init.bind(evaluator));
