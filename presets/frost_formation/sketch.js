let tree = [];
let walkers = [];
let maxWalkers = 200;
let iterations = 1000;
let radius = 4;
let hu = 0;
let shrink = 0.995;
let frostRadius = 200;
let frostIterations = 100;

let isRecording = false;
let maxWalkersSlider;
let frostRadiusSlider;
let radiusSlider;
let stickySlider;
let resetButton;
let recFrames;
let recSlider;

function randBorderPoint(seed) {
  if(seed % 4 == 0) {
    return [width * Math.random(), 0];
  }
  if(seed % 4 == 1) {
    return [width * Math.random(), height];
  }
  if(seed % 4 == 2) {
    return [0, height * Math.random()];
  }
  if(seed % 4 == 3) {
    return [width, height * Math.random()];
  }
}

function randCirclePoint() {
  const angle = Math.random() * TWO_PI;
  const d = Math.random() * frostRadius;
  const x = d * Math.cos(angle);
  const y = d * Math.sin(angle);
  return [x + width / 2, y + height / 2];
}

function restart() {
  console.log("restart");
  radius = 4;

  tree = [];
  walkers = [];

  for(let i = 0;i < frostIterations;i++) {
    const angle = TWO_PI * i / frostIterations;
    x = frostRadius * Math.cos(angle) + width / 2;
    y = frostRadius * Math.sin(angle) + height / 2;
    w = new Walker(x, y);
    tree[i] = w;
  }
  
  
  radius *= shrink;
  for (var i = 0; i < maxWalkers; i++) {
    [x, y] = randCirclePoint();
    walkers[i] = new Walker(x, y);
  }
}

function setup() {
  const cnv = createCanvas(640, 640);
  cnv.parent("dropdown");
  colorMode(HSB);
  frameRate(60);

  const button = document.getElementById("download");
  button.addEventListener("click", () => downloadGif(recFrames));

  recFrames = 1000;
  recSlider = new CustomSlider("Record Frames", 0, 0, 100, 1800, recFrames);
  recSlider.init();
  recSlider.onUpdate = () => {
    if (recSlider.getValue() != recFrames) {
      console.log(recSlider.getValue());
      recFrames = recSlider.getValue();
    }
  };

  maxWalkersSlider = new CustomSlider("Walkers", 0, 0, 10, 200, 100, 1);
  maxWalkersSlider.init();
  maxWalkersSlider.onUpdate = () => {
    if(maxWalkersSlider.getValue() != maxWalkers) {
      maxWalkers = maxWalkersSlider.getValue()
    }
  }

  frostRadiusSlider = new CustomSlider("Circle Radius", 0, 0, 100, width / 2, 200, 1);
  frostRadiusSlider.init();
  frostRadiusSlider.onUpdate = () => {
    if(frostRadiusSlider.getValue() != frostRadius) {
      frostRadius = frostRadiusSlider.getValue()
    }
  }

  radiusSlider = new CustomSlider("Walker Radius", 0, 0, 1, 8, 4, 0.05);
  radiusSlider.init();
  radiusSlider.onUpdate = () => {
    console.log(Math.abs(radiusSlider.getValue() / shrink - radius));
    if(Math.abs(radiusSlider.getValue() / shrink - radius) < 0.3) {
      radiusSlider.slider.value(radius);
    } else {
      radius = radiusSlider.getValue();
    }
  }

  stickySlider = new CustomSlider("Sticking Coefficient", 800, 150, 0, 1, 0.5, 0.01);
  stickySlider.init();

  resetButton = new CustomButton("Reset", 0, 0);
  resetButton.init();
  resetButton.onClicked = restart;

  restart();
}

function draw() {
  background(0);
  resetButton.update();
  maxWalkersSlider.update();
  frostRadiusSlider.update();
  radiusSlider.update();
  stickySlider.update();
  recSlider.update();

  for (let i = 0; i < tree.length; i++) {
    tree[i].show();
  }

  // for (let i = 0; i < walkers.length; i++) {
  //   walkers[i].show();
  // }

  for (let n = 0; n < iterations; n++) {
    for (let i = walkers.length - 1; i >= 0; i--) {
      walkers[i].walk();
      if (walkers[i].checkStuck(tree, stickySlider.slider.value())) {
        tree.push(walkers[i]);
        walkers.splice(i, 1);
      }
    }
  }

  var r = walkers[walkers.length - 1]?.r;
  while (walkers.length < maxWalkers && radius > 1) {
    radius *= shrink;
    [x, y] = randCirclePoint();
    walkers.push(new Walker(x, y));
  }
}