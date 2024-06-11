let tree = [];
let walkers = [];
let maxWalkers = 100;
let iterations = 500;
let radius = 16;
let hu = 0;
let shrink = 0.995;
let angleX = 0;
let angleY = 0;
let radiusCamera = 1000;
let frameSlider;
let dropdown;
let frames;
let boxOpacity = 255;
let stickySlider;
let maxWalkersSlider;
let brownianCoeff = 1;
let brownianSlider;

function setup() {
  const cnv = createCanvas(640, 640, WEBGL);
  cnv.parent("dropdown");

  textSize(32);
  textAlign(CENTER, CENTER);

  frames = 30;
  frameRate(frames)
  frameSlider = new CustomSlider("Frame Rate", 800, 150, 1, 60, frames);
  frameSlider.init();
  frameSlider.onUpdate = () => {
    if(frameSlider.getValue() != frames) {
      console.log(frameSlider.getValue());
      frameRate(frameSlider.getValue());
      frames = frameSlider.getValue()
    }
  }

  stickySlider = new CustomSlider("Sticking Coefficient", 800, 150, 0, 1, 0.5, 0.01);
  stickySlider.init();

  maxWalkersSlider = new CustomSlider("Walkers", 0, 0, 10, 200, 100, 1);
  maxWalkersSlider.init();
  maxWalkersSlider.onUpdate = () => {
    if(maxWalkersSlider.getValue() != maxWalkers) {
      maxWalkers = maxWalkersSlider.getValue()
    }
  }

  brownianSlider = new CustomSlider("Brownian Coefficient", 0, 0, 0, 5, 1, 0.1);
  brownianSlider.init();
  brownianSlider.onUpdate = () => {
    if(brownianSlider.getValue() != brownianCoeff) {
      brownianCoeff = brownianSlider.getValue()
    }
  }

  boxSlider = new CustomSlider("Box Opacity", 0, 0, 0, 255, 255, 1);
  boxSlider.init();
  boxSlider.onUpdate = () => {
    if(boxSlider.getValue() != boxOpacity) {
      boxOpacity = boxSlider.getValue()
    }
  }

  
  tree[0] = new Walker(0, 0, 0);  // Start in the center of the canvas in 3D
  radius *= shrink;
  for (var i = 0; i < maxWalkers; i++) {
    walkers[i] = new Walker();
    radius *= shrink;
  }

  mouseDragged();
}

function mouseDragged() {
  if(mouseX >= width || mouseY >= height) return;
  
    angleX = map(mouseX, 0, width, -PI, PI);
    angleY = map(mouseY, 0, height, -PI/2, PI/2);

    // Update the camera position based on mouse movement
    let camX = cos(angleX) * radiusCamera * cos(angleY);
    let camY = sin(angleY) * radiusCamera;
    let camZ = sin(angleX) * radiusCamera * cos(angleY);
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
}

function draw() {
  background(0);
  noFill();
  
  if(boxOpacity == 0) {
    noStroke();
  } else {
    stroke(boxOpacity);
  }
  box(width, height);

  frameSlider.update();
  stickySlider.update();
  maxWalkersSlider.update();
  boxSlider.update();
  brownianSlider.update();

//   orbitControl();
    // Map mouse coordinates to angles

  for (let i = 0; i < tree.length; i++) {
    tree[i].show();
  }

//   for (let i = 0; i < walkers.length; i++) {
//     walkers[i].show();
//   }

  for (let n = 0; n < iterations; n++) {
    for (let i = walkers.length - 1; i >= 0; i--) {
      if(n == 0) {
        walkers[i].show();
      }
      walkers[i].walk(brownianCoeff);
      if (walkers[i].checkStuck(tree, 0.99)) {
        walkers[i].setHue(hu % 360);
        hu += 2;
        tree.push(walkers[i]);
        walkers.splice(i, 1);
      }
    }
  }

  while (walkers.length < maxWalkers && radius > 1) {
    radius *= shrink;
    walkers.push(new Walker());
  }
}
