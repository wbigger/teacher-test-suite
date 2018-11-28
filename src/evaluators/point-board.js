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
        $("#save-button").click(this.saveCorrections);
    },
    saveCorrections: function () {
        console.log(this);
        let form_data = $("#board-form").serializeArray();
        for (var input of form_data) {
            console.log(input);
            let element = input['name'];
            // TODO: put logic here
        }
        return false;
    },
    sayHello: function () {
        console.log("hello");
        return false;
    },
    create: function () {
        let txt = "";
        this.lockObj.answers.forEach(element => {
            let fieldset = $('<fieldset>');
            let legend = $('<legend>').text(element.student.name);
            fieldset.append(legend);
            let textbox = $('<input>',{
                type:'text',
                name:`mq-${element.student.id}`,
                id:`mq-${element.student.id}`//,
                //value: "hello"
            });
            fieldset.append(textbox);
            
            let openAnswerArray = element.itemList.filter(item => {return item.type == "open-answer"; })
            openAnswer = openAnswerArray[0];
            openAnswer.evaluation.pointList.forEach(point => {
                txt += `<span><input type="checkbox" name="" id="oa-${point.short}-${element.student.id}" value="${point.short}">${point.short}</span>`;
                let checkbox = $('<input>',{
                    type:'checkbox',
                    name:`oa-${point.short}-${element.student.id}`,
                    id:`oa-${point.short}-${element.student.id}`,
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
