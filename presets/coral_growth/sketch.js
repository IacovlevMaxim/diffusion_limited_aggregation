let coordinates = [];
const space = 5;
let numx;
let numy;
let Ccolor = [];
let isRecording = false;
let frameSlider;
let meanSlider;
let biasSlider;
let frames;
let mean;
let bias;
let recFrames = 1000;
let recSlider;
const diffusion = 20;

function setup() {
  const cnv = createCanvas(640, 640);
  const button = document.getElementById("download");
  button.addEventListener("click", () => downloadGif(recFrames));

  cnv.parent("dropdown");

  recFrames = 1000;
  recSlider = new CustomSlider("Record Frames", 0, 0, 100, 1800, recFrames);
  recSlider.init();
  recSlider.onUpdate = () => {
    if (recSlider.getValue() != recFrames) {
      console.log(recSlider.getValue());
      recFrames = recSlider.getValue();
    }
  };

  frames = 30;
  frameRate(frames);
  frameSlider = new CustomSlider("Frame Rate", 0, 0, 1, 60, frames);
  frameSlider.init();
  frameSlider.onUpdate = () => {
    if (frameSlider.getValue() != frames) {
      console.log(frameSlider.getValue());
      frameRate(frameSlider.getValue());
      frames = frameSlider.getValue();
    }
  };

  mean = 0.5
  meanSlider = new CustomSlider("Mean Slider", 0, 0, 0, 1, mean, 0.01);
  meanSlider.init();
  meanSlider.onUpdate = () => {
    if (meanSlider.getValue() != mean) {
      mean = meanSlider.getValue();
    }
  };

  bias = 0.1
  biasSlider = new CustomSlider("Deviation Slider", 0, 0, 0, 0.5, bias, 0.01);
  biasSlider.init();
  biasSlider.onUpdate = () => {
    if (biasSlider.getValue() != bias) {
      bias = biasSlider.getValue();
    }
  };

  numx = int(width / space) + space;
  console.log("numx ", numx);
  numy = int(height / space);
  console.log("numy ", numy);

  attractor = width / 2;

  for (var x = 0; x < numx; x++) {
    coordinates[x] = []; // create nested array

    Ccolor[x] = [];

    for (var y = 0; y < numy; y++) {
      coordinates[x][y] = 0;
      Ccolor[x][y] = color(0);
    }
  }
}

function pseudorandom(mean, bias) {
  const r = random();
  const b = mean + bias / 1.5;
  const a = mean - bias / 1.5;
  if(r < mean + bias && r > mean - bias) return random() * (b-a) + a

  return r;
  
}

function draw() {
  background(0);
  frameSlider.update();
  meanSlider.update();
  biasSlider.update();
  recSlider.update();

  for (let cycles = 0; cycles < 4; cycles++) {
    let xcor = int(map(pseudorandom(mean, bias), 0, 1, 1, numx - 4));
    if(xcor > 131) xcor = 131;
    if(xcor < 2) xcor = 2

    console.log(xcor);
    for (let i = 0; i < numy; i++) {
      const inheritedColorIndices = [
        [xcor - 1, i],
        [xcor + 1, i],
        [xcor, i],
      ].find(([a, b]) => coordinates[a][b] != 0);

    if(inheritedColorIndices)  {
        coordinates[xcor][i - 1] = 1;

        const [x_ind, y_ind] = inheritedColorIndices;

        const inheritedColor = Ccolor[x_ind][y_ind];

        Ccolor[xcor][i - 1] = color(
          red(inheritedColor) + random(-diffusion, diffusion),
          green(inheritedColor) + random(-diffusion, diffusion),
          blue(inheritedColor) + random(-diffusion, diffusion)
        );

        i = numy + 1;
      }
      if (i == numy - 1) {
        coordinates[xcor][i] = 1;
        Ccolor[xcor][i] = color(random(255), random(255), random(255));
      }
    }
  }

  for (let x = 0; x < numx; x++) {
    for (let y = 0; y < numy; y++) {
      if (coordinates[x][y] == 1) {
        noStroke();
        fill(Ccolor[x][y]);
        rect(x * space - space, y * space, space, space);
        }
      }
    }
}