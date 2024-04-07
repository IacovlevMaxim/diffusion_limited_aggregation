// https://en.wikipedia.org/wiki/Diffusion-limited_aggregation
const SPEED = 4;
const SIZE = 22;
const COUNT = 1000;
const FRAME_COUNT = 150;
const ROUNDS = 1;
const GEN_RATE = 1;
const AGEOUT = 1000;
const RECORD = false;
let trig_points = []

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

  // Calculate the coordinates of the random point
  const x = r1 * v1.x + r2 * v2.x + r3 * v3.x;
  const y = r1 * v1.y + r2 * v2.y + r3 * v3.y;

  return createVector(x, y);
}

function setup() {
  createCanvas(640, 640);
  colorMode(HSB);

  // https://github.com/timohausmann/quadtree-ts
  qt = new Quadtree({
    width,
    height,
    x: 0, // optional, default:  0
    y: 0, // optional, default:  0
    maxObjects: 8, // optional, default: 10
    maxLevels: 4, // optional, default:  4
  });

  trig_points = [
    createVector(width / 2, 0),
    createVector(0, height),
    createVector(width, height)
  ];

  fill(255);
  noStroke();

  tree = new Tree(qt, world);
  for (let i = 0; i < COUNT; i++) {
    const randVec = randTrianglePoint(...trig_points)
    // particles.push(new Particle(createVector(random(width), random(height))));
    particles.push(new Particle(randVec));
  }

  if (RECORD) {
    enableCapture({
      frameCount: -1,
      frameRate: 30,
      onComplete: () => {
        console.log("done!");
        noLoop();
      },
    });
  }
}

let gen = 0;
let done = false;
let seeded = false;

function draw() {
  let clean = false;

  if (!done) {
    for (let z = 0; z < ROUNDS; z++) {
      background(0);

      qt.clear();

      fill(30);
      noStroke();
      for (let p of particles) {
        if (p.alive) {
          clean = true;
          qt.insert(p);
          p.update();
          p.display();
        }
      }

      strokeWeight(4);
      tree.update(gen * GEN_RATE);
      tree.display();

      if (clean) {
        for (let i = particles.length - 1; i > 0; i--) {
          if (!particles[i].alive) {
            particles.splice(i, 1);
          }
        }
      }
      gen++;
    }

    if (tree.nodes.length > COUNT) {
      console.log("DONE", frameCount, {
        nodes: tree.nodes.length,
        particles: particles.length,
      });
      done = true;

      if (RECORD) {
        stopCapture();
      }
    }
  }

  if (!seeded) {
    // createSeed(random(width), random(height));
    // const seed = randTrianglePoint(...trig_points);
    // createSeed(seed.x, seed.y);
    createSeed(width / 2, 0)
    seeded = true;
  }
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
    let nexts = [],
      node;
    for (let n = 0; n < this.nodes.length; n++) {
      node = this.nodes[n];
      if (gen - node.gen > AGEOUT) continue;
      if (node.seeded > 2) continue;

      const parts = this.qt.retrieve(node);
      for (let part of parts) {
        if (!part.alive) continue;
        const d = dist(node.x, node.y, part.x, part.y);
        if (d < SIZE) {
          // track hit relationship
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
    let node;
    for (let n = 0; n < this.seeds.length; n++) {
      node = this.seeds[n];
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

      // this.p.add(v);
      this.x = constrain(this.x + v.x, 0, width);
      this.y = constrain(this.y + v.y, 0, height);
    }
  }

  display() {
    if (this.alive) {
      //Uncomment this to display the particles
      // ellipse(this.x, this.y, SIZE);
    }
  }

  displayRecurse(level = 0) {
    // stroke((level * 2) % 360, 0, 100 - level);
    stroke(60, 20 + level * 1.5, 100 - level);

    if (this.children.length > 0) {
      this.children.forEach((child) => {
        line(this.x, this.y, child.x, child.y);

        // if(this.y > height - 10 || child.y > height - 10) {
        //   noLoop();
        // }

        child.displayRecurse(level + 1);
      });
    }
  }
}
