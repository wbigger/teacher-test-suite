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
    createItem: function (item, student) {
        let txt = "<div class='item'>";
        let lockItem = undefined;

        if (item.type == "multiple-choice") {
            let itemBody = composer.randomPick(item.bodies);
            
            // shuffle answer but remember the correct answer position
            let correctAnswerText = itemBody.correctAnswer;
            composer.shuffle(itemBody.answers);
            correctAnswerId = itemBody.answers.indexOf(correctAnswerText) + 1; // answer are 1 based

            lockItem = {};
            lockItem.type = item.type;
            lockItem.skills = item.skills.slice();
            lockItem.body = {};
            lockItem.body.question = itemBody.question;
            lockItem.body.answers = itemBody.answers.slice(); // copy values
            lockItem.evaluation = {};
            lockItem.evaluation.points = item.evaluation.points;
            lockItem.evaluation.correctAnswerId = correctAnswerId;

            let idx = "A".charCodeAt(0);

            txt += "<p class='question'>" + composer.currentItem + ". " + itemBody.question + "</p>";
            composer.currentItem++;
            txt += "<p class='answers'>";
            itemBody.answers.forEach(answer => {
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
            lockItem.skills = item.skills.slice();
            lockItem.body = {};
            lockItem.body.question = question;
            lockItem.evaluation = {};
            lockItem.evaluation.pointList = item.evaluation.pointList.slice();

            txt += "<p class='question open-answer'>" + composer.currentItem + ". " + question + "</p>";
            
            // Add point list
            txt += `<p class='points'>Punti: `;
            item.evaluation.pointList.forEach(p=>{
                txt+=`${p.description} (${p.points}p), `
            });
            txt = txt.replace(/, $/,".");
            txt += `</p>`;

            txt += "<p class='answers'>";
            for (let i = 0; i < itemBody.nRows; i++) {
                txt += "<p class='hr'>></p>";
            }
            txt += "</p>"
        };
        // else if (item.type == "text-shuffle") {
        //     let qBody = item.body;
        //     let character = composer.randomPick(qBody.characters);
        //     let place = composer.randomPick(qBody.places);
        //     let figureShape = composer.randomPick(qBody.figure.shapes);
        //     let figureSize = composer.randomPick(qBody.figure.sizes);
        //     let figureColor = composer.randomPick(qBody.figure.colors);
        //     let movement = composer.randomPick(qBody.movements);

        //     // TODO: make this condition more functional
        //     for (let i = 0; i < character.length; i++) {
        //         if (qBody.characters[i] == character) {
        //             place = qBody.places[i];
        //         }
        //     }

        //     if (movement == "up") {
        //         origin = composer.randomPick(["tre quarti", "quattro quinti"]);
        //         dimension = "dell'altezza";
        //         direction = "l'alto";
        //     } else if (movement == "down") {
        //         origin = composer.randomPick(["un quarto", "un quinto"]);
        //         dimension = "dell'altezza";
        //         direction = "il basso";
        //     } else if (movement == "left") {
        //         origin = composer.randomPick(["tre quarti", "quattro quinti"]);
        //         dimension = "della larghezza";
        //         direction = "sinistra";
        //     } else if (movement == "right") {
        //         origin = composer.randomPick(["un quarto", "un quinto"]);
        //         dimension = "della larghezza";
        //         direction = "destra";
        //     }
        //     let qText = qBody.text;
        //     //console.log("composer: " + item.name + " " + student.id);
        //     qText.forEach((t) => { txt += `<p>` + t + `</p>` });
        //     txt = txt.replace(/{{character}}/g, character);
        //     txt = txt.replace(/{{place}}/g, place);
        //     txt = txt.replace(/{{figureShape}}/g, figureShape);
        //     txt = txt.replace(/{{figureSize}}/g, figureSize);
        //     txt = txt.replace(/{{figureColor}}/g, figureColor);
        //     txt = txt.replace(/{{origin}}/g, origin);
        //     txt = txt.replace(/{{dimension}}/g, dimension);
        //     txt = txt.replace(/{{direction}}/g, direction);
        // };
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

        if (items[0].evaluation.pointList) { // TODO: set a better condition :)
            txt += "<div class='points'>"
            // TODO: Set number of points according to JSON
            txt += "Calcolo del punteggio (ogni elemento vale un punto):"
            txt += "<ul>";
            items[0].evaluation.pointList.forEach((obj) => {
                //txt+="<li>"+obj.description+" ("+obj.points+" punto)</li>";
                txt += "<li>" + obj.description + "</li>";
            });
            txt += "</ul>";

            txt += "</div>"
        }

        txt += "<div class='items'>"

        // Put multiple choice first
        let quizArray = items.filter(item => { return item.type == "multiple-choice"; })
        composer.shuffle(quizArray);
        quizArray.forEach(item => {
            let res = composer.createItem(item, student);
            txt += res[0];
            composer.lockList.push(res[1]);
        }
        );

        // Then put open answer
        let openAnswerArray = items.filter(item => { return item.type == "open-answer"; })
        composer.shuffle(openAnswerArray);
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