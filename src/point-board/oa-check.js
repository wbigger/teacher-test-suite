function OACheck(id, pointObj) {
    // TODO add more moons according to pointObj.points
    this.symbolValues = function* (index) {
        while (index > 0) {
            if (index >= 1) {
                index -= 1;
                yield 1;
            } else {
                index -= 0.5;
                yield 0.5;
            }
        }
    };
    this.updateSymbols = function (v) {
        const iterator = this.symbolValues(v);
        [...iterator].forEach((sv, idx) => {
            let svIndex = this.valueSet.indexOf(sv);
            let el = this.element.find(`.oa-check-symbol:nth-child(${idx + 1})`);
            console.log(el);
            el.html(this.contentSet[svIndex]);
            //console.log(svIndex);
        });
    };
    this.goNext = function () {
        this.index = (this.index + 1) % 3;
        this.element.find(".oa-check-symbol").html(this.contentSet[this.index]);
        this.element.find("input").attr("value", this.valueSet[this.index]);
    };
    // constant arrays
    this.valueSet = [0, 1, 0.5];
    this.contentSet = ["🌑", "🌕", "🌓"];
    // init the component
    this.element = $('<span>')
        .addClass("oa-check")
        .attr({
            "name": id,
            "id": id,
        });
    // create a container for symbols
    let symbols = $('<span>')
        .addClass('oa-check-symbols');

    // create a number of symbols equals to the number of points
    // init symbols with the first content of the content list
    [...Array(pointObj.points).keys()].forEach(() =>
        symbols.append(
            $('<span>')
                .addClass('oa-check-symbol')
                .html(this.contentSet[0])
        )
    );

    // create the input element that will feed the form
    let input =
        $('<input>')
            .attr({
                "name": id,
                "id": id,
                type: "hidden",
            });
    // put all together
    this.element.append(symbols, input);
    
    // get the initial value of the component
    initValue = pointObj.studentAnswer;
    initValue = (typeof initValue === "undefined") ? this.valueSet[0] : initValue;
    // update symbols with this value
    this.updateSymbols(initValue);
    // set the event handlers
    this.element.on("click", (el) => {
        this.goNext();
    });
    // return the element
    this.getElement = function () {
        return this.element;
    }
}