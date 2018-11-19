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
        
        if (item.type == "multiple-choice") {
            let itemBody = composer.randomPick(item.bodies);    
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
        } else if (item.type == "open-answer"){
            let itemBody = composer.randomPick(item.bodies);
            let sum = composer.randomPick(itemBody.alternatives);
            let question = itemBody.question + " " + sum;
            txt += "<p class='question'>" + composer.currentItem + ". " + question + "</p>";
            txt += "<p class='answers'>";            
            // for (let i = 0; i < itemBody.nRows; i++) {
            //     txt += "______________________________________________________________________________<br>";
            // }
            txt += "</p>"
        } else if (item.type == "text-shuffle"){
            let qBody = item.body;
            let character = composer.randomPick(qBody.characters);
            let place = composer.randomPick(qBody.places);
            let figureShape = composer.randomPick(qBody.figure.shapes);
            let figureSize = composer.randomPick(qBody.figure.sizes);
            let figureColor = composer.randomPick(qBody.figure.colors);
            let movement = composer.randomPick(qBody.movements); 

            // TODO make this condition more functional
            for (let i = 0; i < character.length; i++) {
                if (qBody.characters[i] == character) {
                    place = qBody.places[i];
                }
            }

            console.log("processing create");
            if (movement == "up") {
                origin = composer.randomPick(["tre quarti", "quattro quinti"]);
                dimension = "dell'altezza";
                direction = "l'alto";
            } else if (movement == "down") {
                origin = composer.randomPick(["un quarto", "un quinto"]);
                dimension = "dell'altezza";
                direction = "il basso";
            } else if (movement == "left") {
                origin = composer.randomPick(["tre quarti", "quattro quinti"]);
                dimension = "della larghezza";
                direction = "sinistra";
            } else if (movement == "right") {
                origin = composer.randomPick(["un quarto", "un quinto"]);
                dimension = "della larghezza";
                direction = "destra";
            }
            let qText = qBody.text;
            console.log("composer: " + item.name + " " + student.seed);
            qText.forEach((t)=>{txt+=`<p>`+t+`</p>`});
            txt = txt.replace(/{{character}}/g,character);
            txt = txt.replace(/{{place}}/g,place);
            txt = txt.replace(/{{figureShape}}/g,figureShape);
            txt = txt.replace(/{{figureSize}}/g,figureSize);
            txt = txt.replace(/{{figureColor}}/g,figureColor);
            txt = txt.replace(/{{origin}}/g,origin);
            txt = txt.replace(/{{dimension}}/g,dimension);
            txt = txt.replace(/{{direction}}/g,direction);
        };
        txt += "</div>";
        return txt;
    },
    create: function (items, student) {
        composer.currentItem = 1;
        Math.seedrandom(student.seed);

        let studentClass = "2Binf"; // TODO: move elsewhere in a JSON
        let subject = "TPSI"; // TODO: move elsewhere in a JSON

        let txt = "<div class='classwork'>";

        txt += "<h1 class='classwork-title'>Verifica scritta di "+subject+"</h1>";
        txt += "<h2 class='classwork-subtitle'>" + student.name + ", classe: " + studentClass + ", data: ___/___/______</h2>";

        txt += "<div class='points'>"
        // TODO: Set number of points according to JSON
        txt += "Calcolo del punteggio (ogni elemento vale un punto):"
        txt+= "<ul>";
        items[0].evaluation.pointList.forEach((obj)=>{
            txt+="<li>"+obj.descriprion+"</li>";
        });
        txt+= "</ul>";

        txt += "</div>"

        txt += "<div class='items'>"
        
        txt += "<h3 class='classwork-items'>Risolvere il seguente esercizio in Processing</h2>";
        // Put multiple choice first
        let quizArray = items.filter(item => {return item.type == "multiple-choice";})
        composer.shuffle(quizArray);
        quizArray.forEach(item => txt += composer.createItem(item, student));

        // Then put open answer
        let openAnswerArray = items.filter(item => {return item.type == "open-answer";})
        composer.shuffle(openAnswerArray);
        openAnswerArray.forEach(item => txt += composer.createItem(item, student));

        // Then put text-shuffle
        //console.log(items);
        let textShuffleArray = items.filter(item => {return item.type == "text-shuffle";})
        //console.log(textShuffleArray);
        composer.shuffle(textShuffleArray);
        //console.log(textShuffleArray);
        textShuffleArray.forEach(item => txt += composer.createItem(item, student));

        txt += "</div>"; // items
        
        txt += "</div>"; // classwork

        return txt;
    }
}
//`+xxx+`