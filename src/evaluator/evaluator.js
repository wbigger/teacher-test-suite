var evaluator = {
    lockObj: {},
    lockFilename: "",
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
            let studentScoreMC = 0; // multiple choice
            let studentScoreOA = 0; // open answer
            classwork.itemList.filter(item => item.type == "multiple-choice")
                .forEach(item => {
                    // Check if student answer is in the range
                    if (item.evaluation.studentAnswer != null) {
                        // TODO: these default should be moved to compose when assignign lock object
                        let correctScore = (item.evaluation.points !== undefined) ? item.evaluation.points : 1;
                        let wrongScore = (item.evaluation.pointsWrong !== undefined) ? item.evaluation.pointsWrong : -0.25;
                        item.evaluation.studentAnswer === item.evaluation.correctAnswerId ?
                            studentScoreMC += correctScore : studentScoreMC += wrongScore;
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
            classwork.student.score = studentScoreMC+studentScoreOA;
        });
        this.writeMarkList();
    },
    computeVote: function (score, maxScore) {
        let vote = Math.round((score / maxScore) * 10);
        let voteHalf = Math.round((score / maxScore) * 10 * 2) / 2; // consider half points

        // add exceptions! :D
        // max vote only if max score
        if ((score !== maxScore) && (vote == 10)) {
            vote = 9.5;
            voteHalf = 9.5;
        }
        // do not assign 9.5 (evil!)
        // if (vote > 9 && vote < 10) {
        //     vote = 9;
        // }
        //return `${vote} (${voteHalf})`;
        return voteHalf;
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
                let studentElement = $('<span>').addClass("score-student").text(`${studentAns !== "null" ? studentAns : '-'}`);
                let correctElement = $('<span>').addClass("score-correct").text(`${correctAns}`);
                let score = $('<li>')
                    .append(idxElement)
                    .append(studentElement)
                    .append(correctElement);
                switch (studentAns) {
                    case correctAns:
                        score.addClass("isCorrect");
                        break;
                    case "null":
                        score.addClass("isOmissis");
                        break;
                    default: score.addClass("isWrong");
                }
                scoreList.append(score);
                if (typeof studentAns === "undefined") { hasUndefined = true; };
            });
            classwork.itemList.filter(it => it.type === "open-answer").forEach(item => {
                let idxElement = $('<span>').addClass("score-idx").text(`${item.idx}.`);
                let scoreSpan = $('<span>').addClass("oa-all-points");
                item.evaluation.pointList.forEach(p => {
                    let shortDesc = $('<span>').addClass("score-short-desc").text(`${p.short}`.replace("-","").replace(" ",""));
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
                if (typeof currentItem.evaluation.points !== "undefined") {
                    return accumulator + currentItem.evaluation.points;
                } else {
                    let points = currentItem.evaluation.pointList.reduce((accumulator, pointItem) => accumulator + pointItem.points, 0);
                    return accumulator + points;
                }
            }, 0);
            let totalScore = $('<div>').addClass('total-score').text(`TOT: ${classwork.student.scoreMC} + ${classwork.student.scoreOA} = ${classwork.student.score} / ${maxScore}`);
            // print the vote rounded to half decimal (6, 6.5, 7, etc)
            console.log(`${classwork.student.name} vote: ${this.computeVote(classwork.student.score, maxScore)} (${(classwork.student.score / maxScore * 10).toFixed(2)})`); //TODO: move this in statistics or other place?
            let card = $('<li>').append(name).append(scoreList).append(totalScore);
            if (hasUndefined) {
                card.addClass("hasUndefined");
                console.log(`${classwork.student.name} has undefined answers.`);
            };
            cardList.append(card);
        });
        $("#results").html(cardList);
    },
    updateTitle: function () {
        $("title").text(`evaluator-${this.lockFilename}`);
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        let inputId = e.target.id;
        if (!file) {
            return;
        }
        evaluator.lockFilename = file.name;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            evaluator.lockObj = JSON.parse(contents);
            (evaluator.updateTitle.bind(evaluator))();
            (evaluator.evaluate.bind(evaluator))();
        };
        reader.readAsText(file);
    },
}

$(document).ready(evaluator.init.bind(evaluator));
