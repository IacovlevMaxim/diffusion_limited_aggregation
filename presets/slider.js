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
        this.onUpdate = () => {};
    }
    init() {
        this.div = createDiv();
        this.div.parent('sliders');
        this.div.class("slider-container");
    
        let labelDiv = createDiv();
        labelDiv.parent(this.div);
        labelDiv.class("label");
    
        this.text = createP(`${this.label} (${this.value})`);
        this.text.parent(labelDiv);
    
        let sliderWrapper = createDiv(); // Create a wrapper for the slider
        sliderWrapper.parent(this.div);
        sliderWrapper.class("slider-wrapper");
    
        // Create a grid container for min value, track, and max value
        let gridContainer = createDiv();
        gridContainer.parent(sliderWrapper);
        gridContainer.class("slider-grid");
    
        let textMin = createP(this.min);
        textMin.parent(gridContainer);
        textMin.class("slider-value");
    
        this.slider = createSlider(this.min, this.max, this.value, this.step);
        this.slider.parent(gridContainer);
        this.slider.class("slider-element");
    
        let textMax = createP(this.max);
        textMax.parent(gridContainer);
        textMax.class("slider-value");
        // textMin.style("justify-content", "flex-end"); 
    }
       
    getValue() {
        return this.slider.value();
    }

    update() {
        this.text.html(`${this.label} <br /> (${this.slider.value()})`);
        this.onUpdate();
    }
}