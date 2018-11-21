var evaluator = {
    lockObj: {},
    responseObj: {},
    marksList: [],
    init: function () {
        console.log("evaluator init");
        evaluator.eventHandler();
    },
    eventHandler: function () {
        $("#lock-input").change(evaluator.readSingleFile);
        $("#response-input").change(evaluator.readSingleFile);
        $("#compare-button").click(evaluator.compare.bind(evaluator));
    },
    compare: function () {
        this.responseObj.answers.forEach(element => {
            lockStudent = this.lockObj.answers.find((ans) => {
                return ans.student == element.student;
            });
            let studentMark = 0;
            element.itemList.map((item, idx) => {
                item.evaluation.responseAnswer === lockStudent.itemList[idx].evaluation.correctAnswer ?
                    studentMark += 1 : studentMark += 0;
            });
            studentMarkObj = {student:element.student,mark:studentMark};
            this.marksList.push(studentMarkObj);
        });
        console.log(this.marksList);
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
            if (inputId == "lock-input") {
                evaluator.lockObj = JSON.parse(contents);
                console.log("lock:");
                console.log(evaluator.lockObj);
            } else if (inputId == "response-input") {
                evaluator.responseObj = JSON.parse(contents);
                console.log("response:");
                console.log(evaluator.responseObj);
            }
            // helper.convertAnswer2Json(contents);
            // helper.displayContents(contents);
        };
        reader.readAsText(file);
    },
}

$(document).ready(evaluator.init);
