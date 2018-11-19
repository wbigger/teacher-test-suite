

var composer = {
    randomPick: function (list) {
        let n = Math.floor(Math.random() * list.length);
        return list[n];
    },
    create: function (questions, student) {
        let question = questions[0];
        let qBody = question.body;
        Math.seedrandom(student.seed);
        let figureShape = composer.randomPick(qBody.figure.shapes);
        let figureSize = composer.randomPick(qBody.figure.sizes);
        let figureColor = composer.randomPick(qBody.figure.colors);
        let movement = composer.randomPick(qBody.movements);
        let sport = composer.randomPick(qBody.characters);
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
        console.log("composer: " + question.name + " " + student.seed);
        let txt = "<div class='question'>";
        txt += "<h1>" + student.name + "</h1>";
        qText.forEach((t)=>{txt+=txt += `<p>`+t+`</p>`});
        txt += `<p></p>`;
        txt += "</div>";
        return txt;
    }
}
//`+xxx+`