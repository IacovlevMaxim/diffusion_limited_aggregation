class CustomSlider {
    constructor(label, x, y, min, max, def, step) {
        this.div = null;
        this.label = label;
        this.text = null;
        this.x = x;
        this.y = y;
        this.min = min;
        this.max = max;
        this.value = def ?? 0;
        this.step = step ?? 1;
    }

    init() {
        this.div = createDiv();
        this.div.parent('main');
        this.div.class("slider");

        this.text = createP(`${this.label} (${this.value})`);
        this.text.parent(this.div);

        let sliderDiv = createDiv();
        sliderDiv.parent(this.div);
        sliderDiv.class("subslider");

        let textMin = createP(this.min);
        textMin.parent(sliderDiv);
        
        this.slider = createSlider(this.min, this.max, this.default, this.step);
        this.slider.parent(sliderDiv);
        this.slider.size(80);

        let textMax = createP(this.max);
        textMax.parent(sliderDiv);
    }

    update() {
        this.text.html(`${this.label} (${this.slider.value()})`)
    }
}