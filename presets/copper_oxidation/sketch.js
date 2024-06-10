let tree = [];
let walkers = [];
let maxWalkers = 50;
let iterations = 1000;
let radius = 8;
let hu = 0;
let shrink = 0.995;
let frameSlider;
let dropdown;
let frames;
let stickySlider;
let isRecording = false;

function setup() {
  const cnv = createCanvas(640, 640);
  const button = document.getElementById("download");
  button.addEventListener("click", () => {
      button.textContent = "Download GIF";
      downloadGif();
  });

  cnv.parent("dropdown");

  textSize(32);
  textAlign(CENTER, CENTER);

  frames = 30;
  frameRate(frames);
  frameSlider = new CustomSlider("Frame Rate", 800, 150, 1, 60, frames);
  frameSlider.init();
  frameSlider.onUpdate = () => {
    if (frameSlider.getValue() != frames) {
      console.log(frameSlider.getValue());
      frameRate(frameSlider.getValue());
      frames = frameSlider.getValue();
    }
  };

  stickySlider = new CustomSlider("Sticking Coefficient", 800, 150, 0, 1, 0.5, 0.01);
  stickySlider.init();

  tree[0] = new Walker(width / 2, height / 2);
  radius *= shrink;
  for (let i = 0; i < maxWalkers; i++) {
    walkers[i] = new Walker();
    radius *= shrink;
  }
}

function draw() {
  background(0);
  if (isRecording) {
  frameSlider.update();
  stickySlider.update();

  for (let i = 0; i < tree.length; i++) {
    tree[i].show();
  }

  for (let i = 0; i < walkers.length; i++) {
    walkers[i].show();
  }

  for (let n = 0; n < iterations; n++) {
    for (let i = walkers.length - 1; i >= 0; i--) {
      walkers[i].walk();
      if (walkers[i].checkStuck(tree, stickySlider.slider.value())) {
        walkers[i].setHue(hu % 360);
        hu += 2;
        tree.push(walkers[i]);
        walkers.splice(i, 1);
      }
    }
  }
  }

  var r = walkers[walkers.length - 1].r;
  while (walkers.length < maxWalkers && radius > 1) {
    radius *= shrink;
    walkers.push(new Walker());
  }
}

function downloadGif() {
  if (isRecording) {
    // Stop recording if already recording    
    saveGif("myAnimation.gif", frameCount / 60); // Download GIF with duration based on frame count
    isRecording = false;
  } else {
    // Start recording if not already recording
    isRecording = true;
  }
}
