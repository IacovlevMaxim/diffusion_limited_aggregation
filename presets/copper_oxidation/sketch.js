// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/034-dla

let tree = [];
let walkers = [];
//var r = 4;
let maxWalkers = 50;
let iterations = 1000;
let radius = 8;
let hu = 0;
let shrink = 0.995;
let slider;
let dropdown;
let frames;

function setup() {
  dropdown = createSelect();
  dropdown.parent("dropdown");
  dropdown.option("variant 1");
  dropdown.option("variant 2");
  dropdown.class("dropdown");

  const cnv = createCanvas(640, 640);
  cnv.parent("dropdown");

  textSize(32);
  textAlign(CENTER, CENTER);

  frames = 30;
  frameRate(frames)
  slider = new CustomSlider("testing", 800, 150, 1, 60, frames);
  slider.init();
  slider.onUpdate = () => {
    if(slider.slider.value() != frames) {
      console.log(slider.slider.value());
      frameRate(slider.slider.value());
      frames = slider.slider.value()
    }
  }

  tree[0] = new Walker(width / 2, height / 2);
  radius *= shrink;
  for (var i = 0; i < maxWalkers; i++) {
    walkers[i] = new Walker();
    radius *= shrink;
  }
}

function draw() {
  background(0);

  slider.update();

  for (let i = 0; i < tree.length; i++) {
    tree[i].show();
  }

  for (let i = 0; i < walkers.length; i++) {
    walkers[i].show();
  }

  for (let n = 0; n < iterations; n++) {
    for (let i = walkers.length - 1; i >= 0; i--) {
      walkers[i].walk();
      if (walkers[i].checkStuck(tree)) {
        walkers[i].setHue(hu % 360);
        hu += 2;
        tree.push(walkers[i]);
        walkers.splice(i, 1);
      }
    }
  }

  var r = walkers[walkers.length - 1].r;
  while (walkers.length < maxWalkers && radius > 1) {
    radius *= shrink;
    walkers.push(new Walker());
  }

}