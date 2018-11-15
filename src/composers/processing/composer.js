

var composer = {
    randomPick: function(list) {
        let n = Math.floor(Math.random()*list.length);
        return list[n];
    },
    create: function(question,student) {
        let qBody = question.body;
        Math.seedrandom(student.seed);
        let figureShape = composer.randomPick(qBody.figure.shapes);
        let figureSize = composer.randomPick(qBody.figure.sizes);
        let figureColor = composer.randomPick(qBody.figure.colors);
        let movement = composer.randomPick(qBody.movements);
        let sport = composer.randomPick(qBody.sports);

        if (movement == "up") {
            origin = composer.randomPick(["tre quarti","quattro quinti"]);
            dimension = "dell'altezza";
            direction = "l'alto";
        } else if (movement == "down"){
            origin = composer.randomPick(["un quarto","un quinto"]);
            dimension = "dell'altezza";
            direction = "il basso";
        } else if (movement == "left") {
            origin = composer.randomPick(["tre quarti","quattro quinti"]);
            dimension = "della larghezza";
            direction = "sinistra";
        } else if (movement == "right"){
            origin = composer.randomPick(["un quarto","un quinto"]);
            dimension = "della larghezza";
            direction = "destra";
        }
        
        console.log("composer: "+question.name+" "+student.seed);
        let txt = "<div class='question'>";
        txt += "<h1>"+student.name+"</h1>";
        txt+=`<p>Si vuole sviluppare un'applicazione per identificare se, durante
        una partita di `+sport+`, la palla è fuori dalla linea del campo.
        Rappresentare la palla come un `+figureShape+` di dimensioni `+figureSize+` e
        di colore `+figureColor+`. Lo sfondo dell'applicazione inizialmente è di colore verde.</p>

        <p>La posizione iniziale della palla è a `+origin+" "+dimension+` dello schermo. Far
        muovere la palla dalla sua origine verso `+direction+`.</p>

        <p>Quando la palla supera la metà dello schermo, lo sfondo si colora di arancione, 
        per indicare che la palla è andata fuori.</p>

        <p>Quando la palla supera i tre quarti dello schermo, lo sfondo si colora di rosso, per evidenziare che 
        la palla è andata molto al di là della linea. Appena la palla entra in questa condizione, fermare
        il movimento della palla.</p>`;
        txt+="</div>";
        return txt;
    }
}
//`+xxx+`