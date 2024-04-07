let coordinates = [];
let space = 5;
let numx;
let numy;
let Ccolor = [];

function setup() {
  createCanvas(640, 640);
  numx = int(width / space) + space;
  console.log("numx ", numx);
  numy = int(height / space);
  console.log("numy ", numy);

  for (var x = 0; x < numx; x++) {
    coordinates[x] = []; // create nested array

    Ccolor[x] = [];

    for (var y = 0; y < numy; y++) {
      coordinates[x][y] = 0;
      Ccolor[x][y] = color(0);
    }
  }
}

function draw() {
  background(0);
  for (let cycles = 0; cycles < 4; cycles++) {
    let xcor = int(random(1, numx - 3));
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
          red(inheritedColor) + random(-20, 20),
          green(inheritedColor) + random(-20, 20),
          blue(inheritedColor) + random(-20, 20)
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
