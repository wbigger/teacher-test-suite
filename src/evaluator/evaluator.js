var evaluator = {
    lockObj: {},
    init: function () {
        console.log("evaluator init");
        $("#nav-container").load("../nav.html");
        this.eventHandler();
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile).bind(this);
        $("#evaluate-button").click(this.evaluate.bind(this));
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
                    item.evaluation.studentAnswer === item.evaluation.correctAnswerId ?
                        studentScore += 1 : studentScore += 0;
                });
            classwork.itemList.filter(item => item.type == "open-answer")
                .forEach(item => {
                    item.evaluation.pointList.forEach(point => {
                        point.studentAnswer === true ?
                            studentScore += 1 : studentScore += 0;
                    });
                });
            classwork.student.score = studentScore;
        });
        this.writeMarkList();
    },
    writeMarkList() {
        console.log(this.lockObj);
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
                    (studentAns === correctAns)? score.addClass("isCorrect") : score.addClass("isWrong") ;
                scoreList.append(score);
                console.log(studentAns);
                if (typeof studentAns === "undefined") {hasUndefined = true;};
            });
            classwork.itemList.filter(it => it.type === "open-answer").forEach(item => {
                let idxElement = $('<span>').addClass("score-idx").text(`${item.idx}.`);
                let score = $('<li>').append(idxElement);
                item.evaluation.pointList.forEach(p => {
                    //console.log(p);
                    let shortDesc = $('<span>').addClass("score-short-desc").text(`${p.short}`);
                    let val = $('<span>').addClass("score-correct").text(`(${p.studentAnswer?1:0}p)`);
                    score.append(shortDesc).append(val);
                });
                //append only if has not undefined answers
            });
            //let card = $('<li>').text(`${classwork.student.name}: ${classwork.student.score}`);
            let totalScore = $('<div>').addClass('total-score').text(`TOT: ${classwork.student.score}`)
            let card = $('<li>').append(name).append(scoreList).append(totalScore);
            if (hasUndefined) {card.addClass("hasUndefined")};
            cardList.append(card);
            
        });
        $("#results").append(cardList);
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
