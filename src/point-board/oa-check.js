function OACheck(id, pointObj) {
    // This function generate an array with the values of each moon
    // in the array
    // this.symbolValues = function* (index) {
    //     while (index > 0) {
    //         if (index >= 1) {
    //             index -= 1;
    //             yield 1;
    //         } else {
    //             index -= 0.5;
    //             yield 0.5;
    //         }
    //     }
    // };

    this.updateSymbols = function () {
        let v = this.currentValue;
        for (var idx = 0; idx < this.maxValue; idx++) {
            let sv = Math.min(Math.max(0, v - idx),1);
            let svIndex = this.valueSet.indexOf(sv);
            let el = this.element.find(`.oa-check-symbol-${idx}`);
            console.log(el);
            el.html(this.contentSet[svIndex]);
        }
        // const iterator = this.symbolValues(v);
        // [...iterator].forEach((sv, idx) => {

        //     //let el = this.element.find(`.oa-check-symbol:nth-child(${idx + 1})`);
        //     let el = this.element.find(`.oa-check-symbol-${idx}`);
        //     console.log(el);
        //     el.html(this.contentSet[svIndex]);
        //     // TODO: add set value?
        //     //console.log(svIndex);
        // });
    };
    this.goNext = function (clickedElement) { // TODO: update with array of moons
        // desired behaviour:
        // - if click on empty moon: make all moon full up to this
        // - if click on full moon: reduce half moon
        // - if click on half moon: reduce half moon
        // get element position
        let elClassName = clickedElement.currentTarget.className;
        let elPos = Number(elClassName.split(`-`)[3]);
        // get element value
        let sv = clickedElement.currentTarget.childNodes[0].nodeValue; // TODO: should use .find
        let svIndex = this.contentSet.indexOf(sv);

        // compute the new currente component value
        svIndex = (svIndex + 1) % 3; // TODO: make more generic, now 3 is the lenght of value set
        let newValue = this.valueSet[svIndex];
        this.currentValue = elPos + newValue;
        console.log(JSON.stringify(clickedElement));
        //this.element.find(".oa-check-symbol").html(this.contentSet[this.index]);
        //this.element.find("input").attr("value", this.valueSet[this.index]);
    };

    // constant arrays
    this.valueSet = [0, 1, 0.5];
    this.contentSet = ["🌑", "🌕", "🌓"];
    // constant values
    this.maxValue = pointObj.points;
    // init the component element
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
    [...Array(this.maxValue).keys()].forEach((key) => {
        console.log(key);
        symbols.append(
            $('<span>')
                .addClass(`oa-check-symbol-${key}`)
                //.addClass(`oa-check-symbol`)
                .html(this.contentSet[0])
                .on("click", (el) =>
                    this.goNext(el) // increase value
                )
        );
    }
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
    var initValue = pointObj.studentAnswer;
    initValue = (typeof initValue === "undefined") ? this.valueSet[0] : initValue;
    this.currentValue = initValue;
    // update symbols with this value
    this.updateSymbols();
    // set the event handlers
    this.element.on("click", (el) => {
        // update current value
        this.updateSymbols();
    });
    // return the element
    this.getElement = function () {
        return this.element;
    }
}