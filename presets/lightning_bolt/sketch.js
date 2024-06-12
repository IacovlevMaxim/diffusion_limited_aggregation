let SPEED = 4;
let SIZE = 22;
const COUNT = 1000;
const ROUNDS = 1;
let GEN_RATE = 500;
const AGEOUT = 1000;
let isRecording = false;
let trig_points = [];
let frames;
let genSlider;
let framesSlider;
let speedSlider;
let sizeSlider;
let recFrames = 1000;
let recSlider;

let tree,
  world,
  qt,
  particles = [];

function randTrianglePoint(v1, v2, v3) {
  let r1 = Math.random();
  let r2 = Math.random();

  if (r1 + r2 >= 1) {
    r1 = 1 - r1;
    r2 = 1 - r2;
  }

  let r3 = 1 - r1 - r2;

  const x = r1 * v1.x + r2 * v2.x + r3 * v3.x;
  const y = r1 * v1.y + r2 * v2.y + r3 * v3.y;

  return createVector(x, y);
}

function setup() {
  const cnv = createCanvas(640, 640);
  const button = document.getElementById("download");
  button.addEventListener("click", () => downloadGif(recFrames));

  cnv.parent("dropdown");
  colorMode(HSB);

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

  genSlider = new CustomSlider("Ignite Rate", 0, 0, 1, 1000, GEN_RATE);
  genSlider.init();
  genSlider.onUpdate = () => {
    if (genSlider.getValue() != GEN_RATE) {
      console.log(genSlider.getValue());
      GEN_RATE = genSlider.getValue();
    }
  };

  speedSlider = new CustomSlider("Speed", 0, 0, 1, 8, SPEED);
  speedSlider.init();
  speedSlider.onUpdate = () => {
    if (speedSlider.getValue() != SPEED) {
      console.log(speedSlider.getValue());
      SPEED = speedSlider.getValue();
    }
  };

  sizeSlider = new CustomSlider("Size", 0, 0, 4, 32, SIZE);
  sizeSlider.init();
  sizeSlider.onUpdate = () => {
    if (sizeSlider.getValue() != SPEED) {
      console.log(sizeSlider.getValue());
      SIZE = sizeSlider.getValue();
    }
  };


  qt = new Quadtree({
    width,
    height,
    x: 0,
    y: 0,
    maxObjects: 8,
    maxLevels: 4,
  });

  trig_points = [
    createVector(width / 2, 0),
    createVector(0, height),
    createVector(width, height),
  ];

  fill(255);
  noStroke();

  tree = new Tree(qt, world);
  for (let i = 0; i < COUNT; i++) {
    const randVec = randTrianglePoint(...trig_points);
    particles.push(new Particle(randVec));
  }
}

let gen = 0;
let done = false;
let seeded = false;

function draw() {
    background(0);
    frameSlider.update();
    genSlider.update();
    speedSlider.update();
    sizeSlider.update();
    recSlider.update();

    qt.clear();

    fill(30);
    noStroke();
    for (let p of particles) {
      if (p.alive) {
        qt.insert(p);
        p.update();
        p.display();
      }
    }

    strokeWeight(4);
    tree.update(gen * GEN_RATE);
    tree.display();

    particles = particles.filter(p => p.alive);

    if (tree.nodes.length > COUNT) {
      done = true;
    }

    if (!seeded) {
      createSeed(width / 2, 0);
      seeded = true;
    }

    gen++;
  
}

function mousePressed() {
  createSeed(mouseX, mouseY);
}

function createSeed(x, y) {
  const seed = new Particle(createVector(x, y));
  tree.seed(seed);
}

class Tree {
  constructor(qt, g) {
    this.nodes = [];
    this.qt = qt;
    this.g = g;
    this.seeds = [];
  }

  seed(particle) {
    this.seeds.push(particle);
    this.add(particle, gen);
  }

  add(particle, gen) {
    if (particle.treed) return;

    particle.treed = true;
    particle.gen = gen;
    this.nodes.push(particle);
  }

  update(gen) {
    let nexts = [];
    for (let node of this.nodes) {
      if (gen - node.gen > AGEOUT || node.seeded > 2) continue;

      const parts = this.qt.retrieve(node);
      for (let part of parts) {
        if (!part.alive) continue;
        const d = dist(node.x, node.y, part.x, part.y);
        if (d < SIZE) {
          node.children.push(part);
          nexts.push(part);
          part.alive = false;
          node.seeded++;
        }
      }
    }

    for (let particle of nexts) {
      this.add(particle, gen);
    }
  }

  display() {
    for (let node of this.seeds) {
      node.displayRecurse();
    }
  }
}

class Particle extends Quadtree.Circle {
  constructor(p) {
    super({
      x: p.x,
      y: p.y,
      r: SIZE / 2,
    });
    this.alive = true;
    this.seeded = 0;
    this.treed = false;
    this.gen = 0;
    this.children = [];
  }

  update() {
    if (this.alive) {
      const v = p5.Vector.random2D();
      v.mult(SPEED);
      this.x = constrain(this.x + v.x, 0, width);
      this.y = constrain(this.y + v.y, 0, height);
    }
  }

  display() {
    if (this.alive) {
      ellipse(this.x, this.y, SIZE);
    }
  }

  displayRecurse(level = 0) {
    // stroke((level * 2) % 360, 0, 100 - level);
    stroke(60, 30 + level * 1.5, 100 - level);

    if (this.children.length > 0) {
      for (let child of this.children) {
        line(this.x, this.y, child.x, child.y);
        child.displayRecurse(level + 1);
      }
    }
  }
}
