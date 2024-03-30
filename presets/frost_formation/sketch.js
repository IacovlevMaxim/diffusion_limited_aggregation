// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/034-dla

let tree = [];
let walkers = [];
//var r = 4;
let maxWalkers = 100;
let iterations = 1000;
let radius = 8;
let hu = 0;
let shrink = 0.995;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   colorMode(HSB);

//   w = new Walker(width / 2, height / 2);
//   w.setHue(hue % 360);
//   tree[0] = w;
//   radius *= shrink;
//   for (var i = 0; i < maxWalkers; i++) {
//     walkers[i] = new Walker();
//     radius *= shrink;
//   }
// }

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

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  for(let i = 0;i < 100;i++) {
    [x, y] = randBorderPoint(i);
    w = new Walker(x, y);
    tree[i] = w;
  }
  
  
  radius *= shrink;
  for (var i = 0; i < maxWalkers; i++) {
    walkers[i] = new Walker();
    // radius *= shrink;
  }
}

function draw() {
  background(0);

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
        tree.push(walkers[i]);
        walkers.splice(i, 1);
      }
    }
  }

  var r = walkers[walkers.length - 1]?.r;
  while (walkers.length < maxWalkers && radius > 1) {
    radius *= shrink;
    walkers.push(new Walker());
  }

}