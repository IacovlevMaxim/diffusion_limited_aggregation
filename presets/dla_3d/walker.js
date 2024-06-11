class Walker {
    constructor(x, y, z) {
      if (arguments.length == 3) {
        this.pos = createVector(x, y, z);
        this.stuck = true;
      } else {
        this.pos = randomPoint();
        this.stuck = false;
      }
      this.r = radius;
      this.hits = 0;
    }
  
    walk(brownianCoeff) {
      var vel = p5.Vector.random3D();
      vel.mult(brownianCoeff);
      this.pos.add(vel);
      this.pos.x = constrain(this.pos.x, -width / 2, width / 2);
      this.pos.y = constrain(this.pos.y, -height / 2, height / 2);
      this.pos.z = constrain(this.pos.z, -width / 2, width / 2);
    }
  
    checkStuck(others, stickyRate = 1, hitRate = 0) {
      for (var i = 0; i < others.length; i++) {
        let d = distSq(this.pos, others[i].pos);
        if (d < (this.r + others[i].r) ** 2) {
          if (stickyRate < 1 && stickyRate > 0) {
            if (Math.random() < stickyRate) {
              this.stuck = true;
              return true;
            }
          }
          if (hitRate > 0) {
            this.hits++;
            if (this.hits >= hitRate) {
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
      push();
      translate(this.pos.x, this.pos.y, this.pos.z);
      sphere(this.r);
      pop();
    }
  }
  
  function randomPoint() {
    return createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-width / 2, width / 2)
    );
  }
  
  function distSq(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var dz = b.z - a.z;
    return dx * dx + dy * dy + dz * dz;
  }
  