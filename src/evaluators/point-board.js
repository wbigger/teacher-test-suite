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
            console.log("ok:");
            console.log(input);
            let element = input['name'];
            console.log(element);
            // TODO: save the correction file

            // var element = $("#contact_" + form_data[input]['name']);
            // var valid = element.hasClass("valid");
            // var error_element = $("span", element.parent());
            // if (!valid) {
            //     error_element.removeClass("error").addClass("error_show"); error_free = false;
            // }
            // else {
            //     error_element.removeClass("error_show").addClass("error");
            // }
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
            txt += "<fieldset>";
            txt += `<legend>${element.student.name}</legend>`
            txt += `<input type="text" name="mq-${element.student.id}" id="mq-${element.student.id}"/>`;
            let openAnswerArray = element.itemList.filter(item => {return item.type == "open-answer"; })
            openAnswer = openAnswerArray[0];
            openAnswer.evaluation.pointList.forEach(point => {
                txt += `<span><input type="checkbox" name="oa-${point.short}-${element.student.id}" id="oa-${point.short}-${element.student.id}" value="${point.short}">${point.short}</span>`;
            });
            txt += "</fieldset>";
        });
        $("#results").html(txt);
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
