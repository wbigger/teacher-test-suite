var composer = {
    currentItem: 0,
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
        let itemBody = composer.randomPick(item.bodies);

        if (item.type == "multiple-choice") {
            
            //console.log(itemBody.answers);
            composer.shuffle(itemBody.answers);

            let idx = "A".charCodeAt(0);

            txt += "<p class='question'>" + composer.currentItem + ". " + itemBody.question + "</p>";
            composer.currentItem++;
            txt += "<p class='answers'>";
            itemBody.answers.forEach(answer => {
                txt += "<span class='answer'>" + String.fromCharCode(idx) + ". " + answer + "</span> ";
                idx += 1;
            });
            txt += "</p>"
        } else { // open answer
            let sum = composer.randomPick(itemBody.alternatives);
            let question = itemBody.question + " " + sum;
            txt += "<p class='question'>" + composer.currentItem + ". " + question + "</p>";
            txt += "<p class='answers'>";            
            // for (let i = 0; i < itemBody.nRows; i++) {
            //     txt += "______________________________________________________________________________<br>";
            // }
            txt += "</p>"
        };
        txt += "</div>";
        return txt;
    },
    create: function (items, student) {
        composer.currentItem = 1;
        Math.seedrandom(student.seed);

        let studentClass = "3Ainf"; // TODO: move elsewhere in a JSON

        let txt = "<div class='classwork'>";

        txt += "<h1 class='classwork-title'>Verifica scritta di Sistemi e Reti</h1>";
        txt += "<h2 class='classwork-subtitle'>" + student.name + ", classe: " + studentClass + ", data: ___/___/______</h2>";

        // Put multiple choice first
        let quizArray = items.filter(item => {return item.type == "multiple-choice";})
        composer.shuffle(quizArray);
        quizArray.forEach(item => txt += composer.createItem(item, student));

        // Then put open answer
        let openAnswerArray = items.filter(item => {return item.type == "open-answer";})
        composer.shuffle(openAnswerArray);
        openAnswerArray.forEach(item => txt += composer.createItem(item, student));

        txt += "</div>";


        return txt;
    }
}
//`+xxx+`