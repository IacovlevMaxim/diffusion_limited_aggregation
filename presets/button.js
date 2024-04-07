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
        this.button = createButton(this.label);

        this.div = createDiv();
        this.div.parent('sliders');
        this.div.class("button");

        this.button.parent(this.div);
    }

    update() {
        this.button.mousePressed(this.onClicked);
    }
}