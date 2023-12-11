var pointsApp = {
    lockObj: {},
    defaultCorrectAnswer: undefined,
    defaultWrongAnswer: undefined,
    defaultOmittedAnswer: undefined,
    lockFilename: "",
    className:"",
    subject:"",
    init: function () {
        console.log("pointsApp init");
        $(".nav-points>a").addClass("active");
        this.eventHandler();
        this.loadLockObj();
    },
    loadLockObj: function () {
        if (localStorage.getItem("lockObj")) {
            this.lockObj = JSON.parse(localStorage.getItem("lockObj"));
            this.className = this.lockObj.className;
            this.subject = this.lockObj.subject;
            defaultCorrectAnswer = this.lockObj.info.marks.correct;
            defaultWrongAnswer = this.lockObj.info.marks.wrong;
            defaultOmittedAnswer = this.lockObj.info.marks.omitted;
            console.log(`default correct answer: ${this.lockObj.info.marks.correct}`);
            console.log(`default wrong answer: ${this.lockObj.info.marks.wrong}`);
            console.log(`default omitted answer: ${this.lockObj.info.marks.omitted}`);
            this.lockFilename = `eval-${this.className}-${this.subject}.json`;
            $("#results").html("");
            (this.updateTitle.bind(pointsApp))();
            (this.evaluate.bind(pointsApp))();

        } else {
            this.lockObj = {};
        }
    },
    eventHandler: function () {
        $("#save-button").click(this.saveToFile.bind(this));
        $("#lock-input").change(this.readSingleFile.bind(this));
        $("#split-pages").prop('checked', false);
        $("#split-pages").click((e) => {
            let isChecked = e.target.checked;
            if (isChecked) {
                $(".cards>li").addClass("page-break");
                $("ul.scores>li").addClass("display-block");
                console.log("added page-break");
            } else {
                $(".correct-answer").removeClass("page-break");
                $("ul.scores>li").removeClass("display-block");
                console.log("removed page-break");
            }
        });
        $("#rotate-solution").click((e) => {
            let isChecked = e.target.checked;
            if (isChecked) {
                $(".cards>li").addClass("rotate-on-print");
                $("ul.scores>li").addClass("display-block");
                $(".cards>li").addClass("all-border");
                console.log("added rotate-on-print");
            } else {
                $(".correct-answer").removeClass("rotate-on-print");
                $("ul.scores>li").removeClass("display-block");
                $(".cards>li").removeClass("all-border");
                console.log("removed rotate-on-print");
            }
        });
    },
    saveToFile: function () {
        let filename = `eval-${this.className}-${this.subject}.json`;
        this.lockFilename = filename;
        console.log(`Saving to ${filename}`);
        let data = JSON.stringify(this.lockObj);
        let type = "application/json";
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
    idx2abc: function (n) {
        let str = String(n);
        if (str === "undefined") {
            return undefined;
        }
        str = str.replace("1", "A");
        str = str.replace("2", "B");
        str = str.replace("3", "C");
        str = str.replace("4", "D");
        return str;
    },
    evaluate: function () {
        this.lockObj.classworks.forEach(classwork => {
            let studentScoreMC = 0; // multiple choice
            let studentScoreOA = 0; // open answer
            classwork.itemList.filter(item => item.type == "multiple-choice")
                .forEach(item => {
                    // TODO: these default should be moved to compose when assignign lock object
                    let correctScore = (item.evaluation.pointsCorrect !== undefined) ? item.evaluation.pointsCorrect : pointsApp.defaultCorrectAnswer;
                    let wrongScore = (item.evaluation.pointsWrong !== undefined) ? item.evaluation.pointsWrong : pointsApp.defaultWrongAnswer;
                    let omittedScore = (item.evaluation.pointsOmitted !== undefined) ? item.evaluation.pointsOmitted : pointsApp.defaultOmittedAnswer;
                    switch (item.evaluation.studentAnswer) {
                        case null:
                            studentScoreMC += omittedScore;
                            break;
                        case item.evaluation.correctAnswerId:
                            studentScoreMC += correctScore;
                            break;
                        default:
                            studentScoreMC += wrongScore;
                            break;
                    }

                });
            classwork.itemList.filter(item => item.type == "open-answer")
                .forEach(item => {
                    item.evaluation.pointList.forEach(point => {
                        // TODO: separate score for multiple answer and open answer
                        studentScoreOA += parseFloat(point.studentAnswer);
                    });
                });
            classwork.student.scoreMC = studentScoreMC;
            classwork.student.scoreOA = studentScoreOA;
            classwork.student.score = studentScoreMC + studentScoreOA;
        });
        this.writeMarkList();
    },
    getPoints(studentAns, correctAns, evaluation) {
        switch (studentAns) {
            case correctAns:
                return evaluation.pointsCorrect;
            case "null":
                return evaluation.pointsOmitted;
            default:
                return evaluation.pointsWrong;
        }
    },
    getAnswerClass(studentAns, correctAns) {
        switch (studentAns) {
            case correctAns:
                return "isCorrect";
            case "null":
                return "isOmissis";
            default:
                return "isWrong";
        }
    },
    writeMarkList() {
        let cardList = $('<ul>').addClass('cards');
        this.lockObj.classworks.forEach((classwork) => {
            let hasUndefined = false;
            let studentName = `${classwork.student.givenName} ${classwork.student.familyName} `
            let name = $('<h2>').text(studentName);
            let scoreList = $('<ul>').addClass('scores');
            classwork.itemList.filter(it => it.type === "multiple-choice").forEach(item => {
                // Convert numeric idx (1234) to character (ABCD)
                let studentAns = this.idx2abc(item.evaluation.studentAnswer);
                let correctAns = this.idx2abc(item.evaluation.correctAnswerId);
                // Create the list of student and correct answers
                let idxElement = $('<span>').addClass("score-idx").text(`${item.idx}.`);
                let points = this.getPoints(studentAns, correctAns, item.evaluation);

                let studentElement = $('<span>').addClass("score-student").text(`${studentAns !== "null" ? studentAns + ' ' : ''}${points}p`);
                let correctElement = $('<span>').addClass("score-correct").text(`${correctAns}`);
                let score = $('<li>')
                    .append(idxElement)
                    .append(correctElement)
                    .append(studentElement);
                answerClass = this.getAnswerClass(studentAns, correctAns);
                score.addClass(answerClass);
                scoreList.append(score);
                if (typeof studentAns === "undefined") { hasUndefined = true; };
            });
            classwork.itemList.filter(it => it.type === "open-answer").forEach(item => {
                let idxElement = $('<span>').addClass("score-idx").text(`${item.idx}.`);
                let scoreSpan = $('<span>').addClass("oa-all-points");
                item.evaluation.pointList.forEach(p => {
                    let shortDesc = $('<span>').addClass("score-short-desc").text(`${p.short}`.replace("-", "").replace(" ", ""));
                    let val = $('<span>').addClass("score-correct").text(`${p.studentAnswer}p`);
                    let pSpan = $('<span>').addClass("oa-point").append(shortDesc).append(val);
                    scoreSpan.append(pSpan);
                });
                let score = $('<li>').append(idxElement).append(scoreSpan);
                //TODO: append only if has not undefined answers
                scoreList.append(score);
            });
            //let card = $('<li>').text(`${classwork.student.name}: ${classwork.student.score}`);
            let maxScore = classwork.itemList.reduce((accumulator, currentItem) => {
                if (typeof currentItem.evaluation.pointsCorrect !== "undefined") {
                    return accumulator + currentItem.evaluation.pointsCorrect;
                } else {
                    let points = currentItem.evaluation.pointList.reduce((accumulator, pointItem) => accumulator + pointItem.points, 0);
                    return accumulator + points;
                }
            }, 0);
            let totalScore = $('<div>').addClass('total-score').text(`TOT: ${classwork.student.scoreMC} + ${classwork.student.scoreOA} = ${classwork.student.score} / ${maxScore}`);
            // print the vote rounded to half decimal (6, 6.5, 7, etc)
            // const {vote,voteDec} = this.computeVote(classwork.student.score, maxScore)
            // console.log(`${classwork.student.familyName} vote: ${vote} (${voteDec.toFixed(2)})`); //TODO: move this in statistics or other place?
            let card = $('<li>').append(name).append(scoreList).append(totalScore);
            if (hasUndefined) {
                card.addClass("hasUndefined");
                console.log(`${classwork.student.familyName} has undefined answers.`);
            };
            cardList.append(card);
        });
        $("#results").html(cardList);
    },
    updateTitle: function () {
        $("title").text(`eval-${this.className}-${this.subject}`);
        
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        let inputId = e.target.id;
        if (!file) {
            return;
        }
        pointsApp.lockFilename = file.name;
        var reader = new FileReader();
        reader.onerror = function () {
            alert(`cannot read input file ${file.name}`)
        };
        reader.onload = function (e) {
            var contents = e.target.result;
            pointsApp.lockObj = JSON.parse(contents);
            localStorage.setItem("lockObj", contents);
            pointsApp.loadLockObj();
            (pointsApp.updateTitle.bind(pointsApp))();
            (pointsApp.evaluate.bind(pointsApp))();
        };
        reader.readAsText(file);
    },
}

$(document).ready(pointsApp.init.bind(pointsApp));
