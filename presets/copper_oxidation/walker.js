// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/034-dla

class Walker {
  constructor(x, y) {
    if (arguments.length == 2) {
      this.pos = createVector(x, y);
      this.stuck = true;
    } else {
      this.pos = randomPoint();
      this.stuck = false;
    }
    this.r = radius;
    this.hits = 0;
  }

  walk() {
    var vel = p5.Vector.random2D();
    this.pos.add(vel);
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }


  checkStuck(others, stickyRate = 1, hitRate = 0) {
    for (var i = 0; i < others.length; i++) {
      let d = distSq(this.pos, others[i].pos);
      if (d < (this.r + others[i].r) ** 2) {
        if(stickyRate < 1 && stickyRate > 0) {
          if(Math.random() < stickyRate) {
            this.stuck = true;
            return true;
          }
        }
        if(hitRate > 0) {
          this.hits++;
          if(this.hits >= hitRate) {
            this.stuck = true;
            return true;
          }
        }
      }
    }
    return false;
  }

  setHue(hu) {
    this.hu = hu;
  }

  show() {
    noStroke();
    if (this.stuck && typeof this.hu !== 'undefined') {
      fill(this.hu, 255, 100, 200);
    } else {
      fill(360, 0, 255);
    }
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }


}

function randomPoint() {
  return createVector(width * Math.random(), height * Math.random())
}



function distSq(a, b) {
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return dx * dx + dy * dy;
}