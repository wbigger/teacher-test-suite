var evaluator = {
    lockObj: {},
    init: function () {
        console.log("evaluator init");
        $("#nav-container").load("../index.html #nav-container>nav");
        this.eventHandler();
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile).bind(this);
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
            let studentScore = 0;
            classwork.itemList.filter(item => item.type == "multiple-choice")
                .forEach(item => {
                    // TODO: to be tested
                    if (item.evaluation.studentAnswer != '-') {
                        let correctScore = item.evaluation.points;
                        let wrongScore = item.evaluation.pointsWrong;
                        item.evaluation.studentAnswer === item.evaluation.correctAnswerId ?
                            studentScore += correctScore : studentScore += wrongScore;
                    }
                });
            classwork.itemList.filter(item => item.type == "open-answer")
                .forEach(item => {
                    item.evaluation.pointList.forEach(point => {
                        studentScore += parseFloat(point.studentAnswer);
                    });
                });
            classwork.student.score = studentScore;
        });
        this.writeMarkList();
    },
    computeVote: function (score, maxScore) {
        //let vote = Math.round((score/maxScore)*10*2)/2;
        let vote = Math.round((score / maxScore) * 10);
        // add exceptions! :D
        // max vote only if max score
        if ((score !== maxScore) && (vote == 10)) {
            vote = 9.5;
        }
        // do not assign 9.5 (evil!)
        // if (vote > 9 && vote < 10) {
        //     vote = 9;
        // }
        return vote;
    },
    writeMarkList() {
        let cardList = $('<ul>').addClass('cards');
        this.lockObj.classworks.forEach((classwork) => {
            let hasUndefined = false;
            let name = $('<h2>').text(`${classwork.student.name}`);
            let scoreList = $('<ul>').addClass('scores');
            classwork.itemList.filter(it => it.type === "multiple-choice").forEach(item => {
                // Convert numeric idx (1234) to character (ABCD)
                let studentAns = this.idx2abc(item.evaluation.studentAnswer);
                let correctAns = this.idx2abc(item.evaluation.correctAnswerId);
                // Create the list of student and correct answers
                let idxElement = $('<span>').addClass("score-idx").text(`${item.idx}.`);
                let studentElement = $('<span>').addClass("score-student").text(`${studentAns}`);
                let correctElement = $('<span>').addClass("score-correct").text(`(${correctAns})`);
                let score = $('<li>')
                    .append(idxElement)
                    .append(studentElement)
                    .append(correctElement);
                (studentAns === correctAns) ? score.addClass("isCorrect") : score.addClass("isWrong");
                scoreList.append(score);
                if (typeof studentAns === "undefined") { hasUndefined = true; };
            });
            classwork.itemList.filter(it => it.type === "open-answer").forEach(item => {
                let idxElement = $('<span>').addClass("score-idx").text(`${item.idx}.`);
                let score = $('<li>').append(idxElement);
                item.evaluation.pointList.forEach(p => {
                    let shortDesc = $('<span>').addClass("score-short-desc").text(`${p.short}`);
                    let val = $('<span>').addClass("score-correct").text(`(${p.studentAnswer}p)`);
                    score.append(shortDesc).append(val);
                });
                //TODO: append only if has not undefined answers
                scoreList.append(score);
            });
            //let card = $('<li>').text(`${classwork.student.name}: ${classwork.student.score}`);
            let maxScore = classwork.itemList.reduce((accumulator, currentItem) => {
                if (typeof currentItem.evaluation.points !== "undefined") {
                    return accumulator + currentItem.evaluation.points;
                } else {
                    let points = currentItem.evaluation.pointList.reduce((accumulator, pointItem) => accumulator + pointItem.points, 0);
                    return accumulator + points;
                }
            }, 0);
            let totalScore = $('<div>').addClass('total-score').text(`TOT: ${classwork.student.score}/${maxScore}`);
            // print the vote rounded to half decimal (6, 6.5, 7, etc)
            console.log(`${classwork.student.name} vote: ${this.computeVote(classwork.student.score, maxScore)}`); //TODO: move this in statistics or other place?
            let card = $('<li>').append(name).append(scoreList).append(totalScore);
            if (hasUndefined) {
                card.addClass("hasUndefined");
                console.log(`${classwork.student.name} has undefined answers.`);
            };
            cardList.append(card);
        });
        $("#results").html(cardList);
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
            (evaluator.evaluate.bind(evaluator))();
        };
        reader.readAsText(file);
    },
}

$(document).ready(evaluator.init.bind(evaluator));
