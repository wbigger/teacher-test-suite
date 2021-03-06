var app = {
    teacherMaxVote: 10,
    certDiscount: .13, // how much discount on max score for certified student (es. dsa)
    isCertDiscountApplied: true, // if the cert discount is actually applied
    lockObj: {},
    lockFilename: "",
    init: function () {
        console.log("stats init");
        $("#nav-container").load("../index.html #nav-container>nav");
        this.loadLockObj();
        this.eventHandler();
    },
    loadLockObj: function () {
        if (localStorage.getItem("lockObj")) {
            this.lockObj = JSON.parse(localStorage.getItem("lockObj"));
            this.lockFilename = "local-storage.json";
            $("#results").html("");
            (this.updateTitle.bind(this))();
            (this.stats.bind(this))();
        } else {
            this.lockObj = {};
        }
    },
    eventHandler: function () {
        $("#lock-input").change(this.readSingleFile).bind(this);
    },
    computeVote: function (score, maxScore) {
        let vote = Math.round((score / maxScore) * this.teacherMaxVote);
        let voteHalf = Math.round((score / maxScore) * this.teacherMaxVote * 2) / 2; // consider half points

        // add exceptions! :D
        // max vote only if max score
        if ((score !== maxScore) && (vote == 10)) {
            vote = 9.5;
            voteHalf = 9.5;
        }
        // do not assign 9.5 (evil!)
        // if (vote > 9 && vote < 10) {
        //     vote = 9;
        // }
        //return `${vote} (${voteHalf})`;
        return voteHalf;
    },
    stats: function () {
        this.lockObj.classworks.forEach((classwork) => {
            let row = $('<div>').addClass('table-row');
            let maxScore = classwork.itemList.reduce((accumulator, currentItem) => {
                if (typeof currentItem.evaluation.points !== "undefined") {
                    return accumulator + currentItem.evaluation.points;
                } else {
                    let points = currentItem.evaluation.pointList.reduce((accumulator, pointItem) => accumulator + pointItem.points, 0);
                    return accumulator + points;
                }
            }, 0);
            if (this.isCertDiscountApplied) {
                maxScore = classwork.student.cert ? Math.round(maxScore * (1-this.certDiscount)) : maxScore;
            }
            // print the vote rounded to half decimal (6, 6.5, 7, etc)
            let name = $('<div>')
                .addClass('table-cell')
                .text(classwork.student.name.substring(0,12));
            let scoreMC = $('<div>')
                .addClass('table-cell')
                .text(classwork.student.scoreMC);
            let scoreOA = $('<div>')
                .addClass('table-cell')
                .text(classwork.student.scoreOA);
            let score = $('<div>')
                .addClass('table-cell')
                .text(classwork.student.score);
            let maxScoreElem = $('<div>')
                .addClass('table-cell')
                .text(maxScore);
            let vote = $('<div>')
                .addClass('table-cell')
                .text(this.computeVote(classwork.student.score, maxScore));
            let voteNotRounded = $('<div>')
                .addClass('table-cell')
                .text((classwork.student.score / maxScore * this.teacherMaxVote).toFixed(2));
            row
                .append(name)
                .append(scoreMC)
                .append(scoreOA)
                .append(score)
                .append(maxScoreElem)
                .append(vote)
                .append(voteNotRounded);
            $('#results').append(row);
        });
        // Add last recap line
        // add filter, if needed

        // let avgScoreMC = classwork.itemList.reduce((accumulator, currentItem) => 
        //     accumulator = (accumulator + currentItem.scoreMC)
        // , 0) / 
    },

    updateTitle: function () {
        $("title").text(`stats-${this.lockFilename}`);
    },
    readSingleFile: function (e) {
        // from stackoverflow
        var file = e.target.files[0];
        let inputId = e.target.id;
        if (!file) {
            return;
        }
        app.lockFilename = file.name;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            app.lockObj = JSON.parse(contents);
            $("#results").text("");
            (app.updateTitle.bind(app))();
            (app.stats.bind(app))();
        };
        reader.readAsText(file);
    },
}

$(document).ready(app.init.bind(app));
