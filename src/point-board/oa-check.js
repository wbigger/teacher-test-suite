function OACheck(id,pointObj) {
    // TODO add more moons according to pointObj.points
    this.goNext = function () {
        this.index = (this.index + 1) % 3;
        this.element.find(".oa-check-symbol").html(this.contentSet[this.index]);
        this.element.find("input").attr("value", this.valueSet[this.index]);
    };
    // init the element
    this.element = $('<span>')
        .addClass("oa-check")
        .attr({
            "name": id,
            "id": id,
        });
    let symbol = $('<span>')
        .addClass('oa-check-symbol');
    let input =
        $('<input>')
            .attr({
                "name": id,
                "id": id,
                type: "hidden",
            });
    this.element.append(symbol, input);
    // init the sets
    this.valueSet = [0, 1, 0.5];
    this.contentSet = ["🌑", "🌕", "🌓"];
    // Init the index to the init value less one (we will add one later)
    initValue = pointObj.studentAnswer;
    initValue = (typeof initValue === "undefined")?this.valueSet[0]:initValue;
    this.index = this.valueSet.indexOf(parseFloat(initValue)) - 1;
    console.log(this.index);
    // ...so that calling goNext set everything right
    this.goNext();
    // set the event handlers
    this.element.on("click", (el) => {
        this.goNext();
    });
    // return the element
    this.getElement = function () {
        return this.element;
    }
}