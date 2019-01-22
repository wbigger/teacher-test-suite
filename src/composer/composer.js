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
    createItem: function (item, student) {
        let lockItem = undefined;
        let htmlItem = $("<div>").addClass("item");
        if (item.type == "multiple-choice") {
            let itemBody = composer.randomPick(item.bodies);

            // shuffle answer but remember the correct answer position
            // please note that answers are 1 based
            let correctAnswerText = itemBody.answers[item.evaluation.correctAnswer - 1];
            let itemBodyAnswers = itemBody.answers.slice(); // do not modify original itemBody
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
            lockItem.evaluation.points = item.evaluation.points;
            lockItem.evaluation.correctAnswerId = correctAnswerId;

            let baseChar = "A".charCodeAt(0);
            let question = composer.md2html(itemBody.question);

            let htmlQuestion = $("<p>").addClass("question").text(`${composer.currentItem}. ${question}`);
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
            lockItem.idx = composer.currentItem;
            lockItem.skills = item.skills.slice();
            lockItem.body = {};
            lockItem.body.question = question;
            lockItem.evaluation = {};
            lockItem.evaluation.pointList = item.evaluation.pointList.slice();

            let htmlQuestion = $("<p>").addClass("question open-answer").text(`${composer.currentItem}. ${question}`);
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
            if (typeof itemBody.nRows !== "undefined") {
                for (let i = 0; i < itemBody.nRows; i++) {
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
    create: function (items, student, studentClass, subject) {
        // init composer (maybe use as a class?)
        composer.currentItem = 1;
        composer.lockList = [];
        Math.seedrandom(student.id);

        let htmlClasswork = $("<div>").addClass('classwork');
        let htmlTitle = $("<h1>").addClass('classwork-title').text("Verifica scritta di " + subject);
        let htmlSubTitle = $("<h2>").addClass('classwork-subtitle').text(student.name + ", classe: " + studentClass + ", data: ___/___/______");

        let htmlItems = $("<div>").addClass('items');

        // Put multiple choice first
        let quizArray = items.filter(item => { return item.type == "multiple-choice"; }).slice();
        composer.shuffle(quizArray);
        quizArray.forEach(item => {
            let res = composer.createItem(item, student);
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
        htmlClasswork.append(htmlTitle, htmlSubTitle, htmlItems);

        return [htmlClasswork, composer.lockList];
    }
}