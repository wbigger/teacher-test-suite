var composer = {
    currentItem: 0,
    lockList: [],
    randomPick: function (list) {
        let n = Math.floor(Math.random() * list.length);
        return list[n];
    },
    /**
     * Shuffles array in place.
     * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
     * @param {Array} a items An array containing the items.
     */
    shuffle: function (a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },
    md2html: function (txt) {
        txt = txt.replace(/\*\*(.*)\*\*/, "<strong>$1</strong>");
        return txt;
    },
    createItem: function (item, student, marks) {
        let lockItem = undefined;
        let htmlItem = $("<div>").addClass("item");
        if (item.type == "multiple-choice") {
            let itemBody = composer.randomPick(item.bodies);

            // shuffle answer but remember the correct answer position
            // please note that answers are 1 based
            const evaluationCorrectAnswer = (item.evaluation === undefined) ? 0 : item.evaluation.correctAnswer - 1;
            const evaluationPointsCorrect = Object.is(item.evaluation, undefined) ? marks.correct : item.evaluation.pointsCorrect;
            const evaluationPointsWrong = Object.is(item.evaluation, undefined) ? marks.wrong : item.evaluation.pointsWrong;
            let correctAnswerText = itemBody.answers[evaluationCorrectAnswer];
            let itemBodyAnswers = itemBody.answers.slice(); // do not modify original itemBody
            if (student.cert != undefined) {
                itemBodyAnswers.pop();
            }
            composer.shuffle(itemBodyAnswers);
            correctAnswerId = itemBodyAnswers.indexOf(correctAnswerText) + 1;
            lockItem = {};
            lockItem.type = item.type;
            lockItem.idx = composer.currentItem;
            lockItem.skills = item.skills.slice(); // slices: copy values
            lockItem.body = {};
            lockItem.body.question = itemBody.question;
            lockItem.body.answers = itemBodyAnswers.slice(); // slices: copy values
            lockItem.evaluation = {};
            lockItem.evaluation.pointsCorrect = evaluationPointsCorrect;
            lockItem.evaluation.correctAnswerId = correctAnswerId;
            lockItem.evaluation.pointsWrong = evaluationPointsWrong;

            let baseChar = "A".charCodeAt(0);
            let question = composer.md2html(itemBody.question);

            let htmlQuestion = $("<p>").addClass("question").html(`${composer.currentItem}. ${question}`);
            composer.currentItem++;
            let htmlAnswer = $("<p>").addClass("answers");
            itemBodyAnswers.forEach((answer, idx) => {
                let htmlSpan = $("<span>").addClass("answer").text(`${String.fromCharCode(baseChar + idx)}. ${answer}`);
                if (idx === correctAnswerId - 1) {
                    htmlSpan.addClass("correct-answer");
                }
                // add a space to allow line wrap
                htmlAnswer.append(htmlSpan, " ");
            });
            htmlItem.append(htmlQuestion, htmlAnswer);
        } else if (item.type == "open-answer") {
            let itemBody = composer.randomPick(item.bodies);
            let question = itemBody.question;
            let regex = /{{([a-z]+)}}/g; //TODO: should match multiple with while
            let match = regex.exec(question);
            if (match !== null) {
                let token = match[1];
                choice = composer.randomPick(itemBody[token]);
                question = question.replace("{{" + token + "}}", choice);
            }

            lockItem = {};
            lockItem.type = item.type;
            lockItem.nRows = item.nRows;
            lockItem.idx = composer.currentItem;
            lockItem.skills = item.skills.slice();
            lockItem.body = {};
            lockItem.body.question = question;
            lockItem.evaluation = {};
            lockItem.evaluation.pointList = item.evaluation.pointList.slice();

            let htmlQuestion = $("<p>").addClass("question open-answer").html(`${composer.currentItem}. ${question}`);
            composer.currentItem++;

            // Add point list
            let htmlPoints = $("<p>").addClass("points");
            let txt = "";
            txt += `Punti: `;
            item.evaluation.pointList.forEach(p => {
                txt += `${p.description} (${p.points}p), `
            });
            txt = txt.replace(/, $/, ".");
            htmlPoints.text(txt);

            let htmlAnswer = $("<p>").addClass("answers");
            if (typeof itemBody.imgUrls !== "undefined") {
                let imgUrls = itemBody.imgUrls.slice();
                composer.shuffle(imgUrls);
                let img = $("<img>")
                    .attr("src", composer.randomPick(imgUrls))
                    .addClass("open-answer-img");
                htmlAnswer.append(img);
            }
            
            // nRows can be specified on the item or on each question
            // the more specific is used
            let nRows = itemBody.nRows || item.nRows;
            if (nRows) {
                for (let i = 0; i < nRows; i++) {
                    let row = $("<p>").addClass("hr");
                    htmlAnswer.append(row);
                }
                let hint = $("<p>").addClass("open-answer-hint").text(item.evaluation.hint);
                htmlAnswer.append(hint);
            }
            htmlItem.append(htmlQuestion, htmlPoints, htmlAnswer);
        };
        if (typeof lockItem != "undefined") {
            return [htmlItem, lockItem];
        }
        return htmlItem;
    },
    create: function (items, student, studentClass, subject, info) {
        // init composer (maybe use as a class?)
        composer.currentItem = 1;
        composer.lockList = [];
        Math.seedrandom(student.email);

        let name = `${student.givenName} ${student.familyName}`;
        let htmlClasswork = $("<div>").addClass('classwork');
        let htmlTitle = $("<h1>").addClass('classwork-title').text("Verifica scritta di " + subject);
        let htmlSubTitle = $("<h2>").addClass('classwork-subtitle').text(name + ", " + studentClass + ", data: ___/___/______");
        let notes = `Nelle domande a risposta multipla: risposta corretta ${info.marks.correct}, omessa ${info.marks.omitted} ed errata
        ${info.marks.wrong}. ${info.notes}`
        let htmlNotes = $("<p>").addClass('classwork-notes').text(notes);

        let htmlItems = $("<div>").addClass('items');

        // Put multiple choice first
        let quizArray = items.filter(item => {
            return (item.type == "multiple-choice") &&
                ((student.cert !== item.skipCert) || (typeof student.cert === "undefined"));
        })
            .slice();
        composer.shuffle(quizArray);
        quizArray.forEach(item => {
            let res = composer.createItem(item, student, info.marks);
            htmlItems.append(res[0]);
            composer.lockList.push(res[1]);
        }
        );

        // Then put open answer
        let openAnswerArray = items.filter(item => { return item.type == "open-answer"; }).slice();
        composer.shuffle(openAnswerArray);
        openAnswerArray.forEach(item => {
            let res = composer.createItem(item, student);
            htmlItems.append(res[0]);
            composer.lockList.push(res[1]);
        });
        htmlClasswork.append(htmlTitle, htmlSubTitle, htmlNotes, htmlItems);

        return [htmlClasswork, composer.lockList];
    }
}