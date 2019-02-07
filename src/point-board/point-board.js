sayHello = function () {
    console.log("hello");
    return false;
}
var pointBoard = {
    lockObj: {},
    marksList: [],
    idCounter: 0,
    lockFilename: "",
    init: function () {
        console.log("point board init");
        $("#nav-container").load("../index.html #nav-container>nav");
        this.eventHandler();
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile.bind(this));
        $("#save-button").click(this.saveCorrections.bind(this));
    },
    saveCorrections: function () {
        console.log(this);
        let form_data = $("#board-form").serializeArray();
        for (var input of form_data) {
            let inputName = input['name'];
            let splitName = inputName.split('-');
            let itemType = splitName[0];
            let studentId = splitName[1];
            let itemValue = input['value'];
            let classwork = this.lockObj.classworks
                .find(e => e.student.id == studentId);
            console.log(studentId);
            if (itemType === "mq") {
                let answerText = itemValue.replace(/ /g, '');
                [...answerText].forEach((c, idx) => {
                    classwork.itemList[idx]
                        .evaluation.studentAnswer = parseInt(c);
                });
            } else if (itemType === "oa") {
                let oaIdx = splitName[2].trim();
                let short = splitName[3].trim();
                // find this element and set it to value
                classwork.itemList
                .filter(e => e.type == "open-answer")[oaIdx]
                .evaluation.pointList
                .find(p => p.short === short)
                .studentAnswer = itemValue;
            }

        };
        console.log(this.lockObj);
        this.sayHello(); // sayHello works
        //this.saveTofile(); // TODO: why doesnt work with this function name????
        return false; // do not continue the submit chain
    },
    sayHello: function () { //TODO: rename this function
        console.log("hello");
        let data = JSON.stringify(this.lockObj);
        let filename = this.lockFilename;//`lock-${app.className}-${app.subject}.json`;
        let type = "application/json";
        console.log(`Saving file: ${filename}`); // use string template :)
        // from stackoverflow
        var file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
        return false;
    },
    create: function () {
        this.lockObj.classworks.forEach(element => {
            let fieldset = $('<fieldset>');
            let legend = $('<legend>').text(element.student.name);
            fieldset.append(legend);
            // populate value for multiple choice questions
            let multipleChoiceArray = element.itemList.filter(item => { return item.type == "multiple-choice"; })
            let textboxValue = '';
            multipleChoiceArray.forEach(item => {
                //console.log(item);
                if (typeof item.evaluation.studentAnswer != "undefined") {
                    textboxValue += item.evaluation.studentAnswer;
                }
            });
            let textbox = $('<input>', {
                type: 'text',
                name: `mq-${element.student.id}`,
                id: `mq-${element.student.id}`,
                maxlength: `${multipleChoiceArray.length}`,
                value: textboxValue
            });
            fieldset.append(textbox);

            let openAnswerArray = element.itemList.filter(item => { return item.type == "open-answer"; })
            openAnswerArray.forEach((openAnswer,idx) => {
                let openAnswerElement = $('<span>').addClass('openAnswer');
                openAnswer.evaluation.pointList.forEach((point) => {
                    let checkID = `oa-${element.student.id}-${idx}-${point.short}`;
                    let checkbox = new OACheck(checkID).getElement();
                    let checkspan = $('<span>')
                        .append(checkbox)
                        .append(point.short)
                        .addClass('openAnswerPoint');
                    openAnswerElement.append(checkspan);
                });
                fieldset.append(openAnswerElement);
                let checkAll = $("<input>")
                .attr({
                    type: "button",
                    value: "check all"
                })
                .on("click", (el) => {
                    console.log(`Work in progress ${el}`);
                });
                fieldset.append(checkAll);

            });

            $("#results").append(fieldset);
            $("#board-form").show();
        });
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        let inputId = e.target.id;
        if (!file) {
            return;
        }
        this.lockFilename = file.name;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            pointBoard.lockObj = JSON.parse(contents);
            $("#results").html("");
            (pointBoard.create.bind(pointBoard))();
        };
        reader.readAsText(file);
    },
}

$(document).ready(pointBoard.init.bind(pointBoard));
