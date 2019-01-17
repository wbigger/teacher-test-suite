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
    md2html: function(txt) {
        txt = txt.replace(/\*\*(.*)\*\*/,"<strong>$1</strong>");
        return txt;
    },
    createItem: function (item, student) {
        let txt = "<div class='item'>";
        let lockItem = undefined;

        if (item.type == "multiple-choice") {
            let itemBody = composer.randomPick(item.bodies);
            
            // shuffle answer but remember the correct answer position
            // please note that answers are 1 based
            let correctAnswerText = itemBody.answers[item.evaluation.correctAnswer - 1];
            let itemBodyAnswers = itemBody.answers.slice(); // do not modify original itemBody
            composer.shuffle(itemBodyAnswers); // FIXshuffle
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

            let idx = "A".charCodeAt(0);
            let question = composer.md2html(itemBody.question);

            txt += "<p class='question'>" + composer.currentItem + ". " + question + "</p>";
            composer.currentItem++;
            txt += "<p class='answers'>";
            itemBodyAnswers.forEach(answer => {
                txt += "<span class='answer'>" + String.fromCharCode(idx) + ". " + answer + "</span> ";
                idx += 1;
            });
            txt += "</p>"
            
        } else if (item.type == "open-answer") {
            let itemBody = composer.randomPick(item.bodies);
            let question = itemBody.question;
            let regex = /{{([a-z]+)}}/g; //TODO: should match multiple with while
            let match = regex.exec(question);
            let token = match[1];
            choice = composer.randomPick(itemBody[token]);
            question = question.replace("{{" + token + "}}", choice);

            lockItem = {};
            lockItem.type = item.type;
            lockItem.idx = composer.currentItem;
            lockItem.skills = item.skills.slice();
            lockItem.body = {};
            lockItem.body.question = question;
            lockItem.evaluation = {};
            lockItem.evaluation.pointList = item.evaluation.pointList.slice();

            txt += "<p class='question open-answer'>" + composer.currentItem + ". " + question + "</p>";
            composer.currentItem++;
            
            // Add point list
            txt += `<p class='points'>Punti: `;
            item.evaluation.pointList.forEach(p=>{
                txt+=`${p.description} (${p.points}p), `
            });
            txt = txt.replace(/, $/,".");
            txt += `</p>`;

            txt += "<p class='answers'>";
            for (let i = 0; i < itemBody.nRows; i++) {
                txt += "<p class='hr'></p>";
            }
            txt += "</p>"
        };
        txt += "</div>";
        if (typeof lockItem != "undefined") {
            return [txt, lockItem];
        }
        return txt;
    },
    create: function (items, student, studentClass, subject) {
        // init composer (maybe use as a class?)
        composer.currentItem = 1;
        composer.lockList = [];
        Math.seedrandom(student.id);

        let txt = "<div class='classwork'>";

        txt += "<h1 class='classwork-title'>Verifica scritta di " + subject + "</h1>";
        txt += "<h2 class='classwork-subtitle'>" + student.name + ", classe: " + studentClass + ", data: ___/___/______</h2>";

        // if (items[0].evaluation.pointList) { // TODO: set a better condition :)
        //     txt += "<div class='points'>"
        //     // TODO: Set number of points according to JSON
        //     txt += "Calcolo del punteggio (ogni elemento vale un punto):"
        //     txt += "<ul>";
        //     items[0].evaluation.pointList.forEach((obj) => {
        //         txt += "<li>" + obj.description + "</li>";
        //     });
        //     txt += "</ul>";

        //     txt += "</div>"
        // }

        txt += "<div class='items'>"

        // Put multiple choice first
        let quizArray = items.filter(item => { return item.type == "multiple-choice";}).slice();
        composer.shuffle(quizArray); //FIXshuffle
        quizArray.forEach(item => {
            let res = composer.createItem(item, student);
            txt += res[0];
            composer.lockList.push(res[1]);
        }
        );

        // Then put open answer
        let openAnswerArray = items.filter(item => { return item.type == "open-answer"; }).slice();
        composer.shuffle(openAnswerArray); //FIXshuffle
        openAnswerArray.forEach(item => {
            let res = composer.createItem(item, student);
            txt += res[0];
            composer.lockList.push(res[1]);
        });

        // Then put text-shuffle
        // DEPRACATED: this is replaced by open answer
        // let textShuffleArray = items.filter(item => { return item.type == "text-shuffle"; })
        // composer.shuffle(textShuffleArray);
        // textShuffleArray.forEach(item => txt += composer.createItem(item, student));

        txt += "</div>"; // items

        txt += "</div>"; // classwork
        
        return [txt, composer.lockList];
    }
}
//`+xxx+`