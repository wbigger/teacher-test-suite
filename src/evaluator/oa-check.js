function OACheck() {
    this.goNext = function() {
        this.index = (this.index + 1) % 3;
        this.element.html(this.contentSet[this.index]);
        this.element.attr("value",this.valueSet[this.index]);
    };
    // init the element
    this.element = $('<span>').addClass("oa-check");
    // init the sets
    this.valueSet = [0,1,0.5];
    this.contentSet = ["🌑","🌕","🌓"];
    // Init the index to the last value...
    this.index = (this.valueSet.length-1);
    // ...so that calling goNext set everything right
    this.goNext();
    // set the event handlers
    this.element.on("click",(el)=>{
        this.goNext();
    })
    // return the element
    this.getElement = function() {
        return this.element;
    }
}