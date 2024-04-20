class CustomButton {
    constructor(label, x, y) {
        this.div = null;
        this.label = label;
        this.x = x;
        this.y = y;
        this.button = null;
        this.onClicked = () => {};
    }

    init() {
        this.div = createDiv();
        this.div.parent('sliders');
        this.div.class("button-container"); 
        
        this.button = createButton(this.label);
        this.button.parent(this.div);
        this.button.class("button-element"); 
    }

    update() {
        this.button.mousePressed(this.onClicked);
    }
}