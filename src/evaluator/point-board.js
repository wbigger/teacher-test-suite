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
        this.eventHandler();
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile.bind(this));
        $("#create-board").click(this.create.bind(this));
        $("#save-button").click(this.saveCorrections.bind(this));
    },
    saveCorrections: function () {
        //console.log(this);
        let form_data = $("#board-form").serializeArray();
        for (var input of form_data) {
            let inputName = input['name'];
            let splitName =  inputName.split('-'); 
            let itemType = splitName[0];
            let studentId = splitName[1];
            let classwork = this.lockObj.answers
                .find(e => e.student.id == studentId);
            // TODO: add an unique identifier to items and find it with it
            //console.log(studentId);
            if (itemType === "mq") {
                let answerText = input['value'].replace(/ /g, '');
                [...answerText].forEach((c, idx) => {
                    classwork.itemList[idx]
                        .evaluation.studentAnswer = parseInt(c);
                });
            } else if (itemType === "oa") {
                let short = splitName[2].trim();
                let item = classwork.itemList.find(e=>e.type=="open-answer");
                let eval = item.evaluation.pointList.find(e=>
                    e.short === short
                );
                eval.studentAnswer = true;
            }

        };
        console.log(this.lockObj);
        this.sayHello();
        //this.saveTofile(); // why doesnt work with this function name????
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
        let txt = "";
        this.lockObj.answers.forEach(element => {
            let fieldset = $('<fieldset>');
            let legend = $('<legend>').text(element.student.name);
            fieldset.append(legend);
            let textbox = $('<input>', {
                type: 'text',
                name: `mq-${element.student.id}`,
                id: `mq-${element.student.id}`//,
                //value: "hello"
            });
            fieldset.append(textbox);

            let openAnswerArray = element.itemList.filter(item => { return item.type == "open-answer"; })
            openAnswer = openAnswerArray[0];
            openAnswer.evaluation.pointList.forEach(point => {
                txt += `<span><input type="checkbox" name="" id="oa-${point.short}-${element.student.id}" value="${point.short}">${point.short}</span>`;
                let checkbox = $('<input>', {
                    type: 'checkbox',
                    name: `oa-${element.student.id}-${point.short}`,
                    id: `oa-${element.student.id}-${point.short}`,
                    value: `${point.short}`//,
                    //                    checked: true
                });
                let checkspan = $('<span>').append(checkbox).append(point.short);
                fieldset.append(checkspan);
            });
            $("#results").append(fieldset);
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
        };
        reader.readAsText(file);
    },
}

$(document).ready(pointBoard.init.bind(pointBoard));
