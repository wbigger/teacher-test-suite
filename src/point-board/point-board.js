var pointBoard = {
    lockObj: {},
    marksList: [],
    idCounter: 0,
    lockFilename: "",
    className: "",
    subject: "",
    init: function () {
        console.log("point board init");
        $(".nav-point-board>a").addClass("active");
        this.loadLockObj();
        this.eventHandler();
        //this.getFileFromParams();
    },
    // TODO: get the file from URL
    // we need a File object created by FileList or something similar
    // getFileFromParams: function() {
    //     var url_string = window.location.href
    //     var url = new URL(url_string);
    //     filename = url.searchParams.get("file");
    //     file = ??? how to create a file object from filename ???
    //     if (!file) {
    //         console.log(`Cannot read file ${file}`);    
    //         return;
    //     }
    //     console.log(`Getting file ${file}`);
    //     this.lockFilename = file;
    //     var reader = new FileReader();
    //     reader.onload = function (e) {
    //         var contents = e.target.result;
    //         pointBoard.lockObj = JSON.parse(contents);
    //         $("#results").html("");
    //         (pointBoard.create.bind(pointBoard))();
    //     };
    //     reader.readAsText(file);
    // },
    loadLockObj: function () {
        if (localStorage.getItem("lockObj")) {
            this.lockObj = JSON.parse(localStorage.getItem("lockObj"));
            this.className = this.lockObj.className;
            this.subject = this.lockObj.subject;
            this.lockFilename = "local-storage.json";
            $("#results").html("");
            (pointBoard.updateTitle.bind(pointBoard))();
            (pointBoard.create.bind(pointBoard))();
        } else {
            this.lockObj = {};
        }
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile.bind(this));
        $("#save-button").click(this.saveCorrections.bind(this));
    },
    updateTitle: function () {
        $("title").text(`Point Board - ${this.lockFilename}`);
    },
    saveCorrections: function () {
        console.log(this);
        let form = $("#board-form");
        form.validate();
        // form.preventDefault();
        if (form.valid()) {
            let form_data = form.serializeArray();
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
                        // if omissis, put the student Answer to null
                        let val = RegExp("[1234]").test(c) ? parseInt(c) : null;
                        classwork.itemList[idx]
                            .evaluation.studentAnswer = val;
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
                } else if (itemType === "notes") {
                    classwork.notes = itemValue;
                } else {
                    console.log(`Unknown item type: ${itemType}`);
                }

            };
            console.log(this.lockObj);

            this.saveToFile();
            console.log("Save corrections");
        } else {
            alert("Validation error");
            return true; // get the errors from browser
        }
        return false;
    },
    saveToFile: function () {
        console.log("Saving to file");
        let data = JSON.stringify(this.lockObj);
        let filename = `pointboard-${this.className}-${this.subject}.json`;
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
        localStorage.setItem("lockObj", data);
        return false;
    },
    create: function () {
        this.lockObj.classworks.forEach(element => {
            let fieldset = $('<fieldset>');
            let name = `${element.student.givenName} ${element.student.familyName}`;
            let legend = $('<legend>').text(name);
            fieldset.append(legend);
            // populate value for multiple choice questions
            let multipleChoiceArray = element.itemList.filter(item => { return item.type == "multiple-choice"; })
            let textboxValue = '';
            multipleChoiceArray.forEach(item => {
                //console.log(item);
                if (typeof item.evaluation.studentAnswer != "undefined") {
                    textboxValue += (item.evaluation.studentAnswer != null) ? item.evaluation.studentAnswer : 0;
                }
            });
            let textbox = $('<input>', {
                type: 'text',
                name: `mq-${element.student.id}`,
                id: `mq-${element.student.id}`,
                maxlength: `${multipleChoiceArray.length}`,
                pattern: `[0-4]{${multipleChoiceArray.length}}`,
                size: `${multipleChoiceArray.length}`,
                title: `pattern: [0-4]{${multipleChoiceArray.length}}`,
                value: textboxValue
            });
            fieldset.append(textbox);

            let openAnswerArray = element.itemList.filter(item => { return item.type == "open-answer"; })
            openAnswerArray.forEach((openAnswer, idx) => {
                let openAnswerElement = $('<span>').addClass('openAnswer');
                openAnswer.evaluation.pointList.forEach((point) => {
                    let checkID = `oa-${element.student.id}-${idx}-${point.short}`;
                    let checkbox = new OACheck(checkID, point).getElement();
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
                // fieldset.append(checkAll);

                let notesValue = element.notes;
                let textnotes = $('<input>', {
                    type: 'text',
                    name: `notes-${element.student.id}`,
                    id: `notes-${element.student.id}`,
                    maxlength: 200,
                    size: 50,
                    title: `Notes for this work (max 200 chars)`,
                    value: notesValue
                });
                fieldset.append(textnotes);

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
        this.updateTitle();
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            pointBoard.lockObj = JSON.parse(contents);
            localStorage.setItem("lockObj", contents);
            $("#results").html("");
            evaluator.loadLockObj();
            (pointBoard.updateTitle.bind(pointBoard))();
            (pointBoard.create.bind(pointBoard))();
        };
        // reader.readAsText(file);
    },
}

$(document).ready(pointBoard.init.bind(pointBoard));
