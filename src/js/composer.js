

var composer = {
    randomPick: function(list) {
        let n = Math.floor(Math.random()*list.length);
        return list[n];
    },
    create: function(question,seed) {
        let txt = "composer: "+question.name+" "+seed;
        Math.seedrandom(seed);
        let figure = composer.randomPick(question.figures);
        let position = composer.randomPick(question.positions);
        txt+=", " + figure;
        txt+=", " + position;
        return txt;
    }
}