
//Like a vector 3, but less
export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static clone(vec: Vector2) {
    return new Vector2(vec.x, vec.y);
  }

  dot(rh: Vector2) {
    return this.x * rh.x + this.y * rh.y;
  }

  magnitudeSq() {
    return this.x * this.x + this.y * this.y;
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSq());
  }

  distanceSq(rh: Vector2) {
    return this.subtract(rh).magnitudeSq();
  }

  distance(rh: Vector2) {
    return Math.sqrt(this.distanceSq(rh));
  }

  normalized() {
    let norm = this.magnitude();
    return this.divide(norm);
  }

  normalize() {
    let norm = this.magnitude();
    this.x /= norm;
    this.y /= norm;
  }

  setMagnitude(mag: number) {
    this.normalize();
    this.x *= mag;
    this.y *= mag;
  }

  sum(rh: Vector2) {
    return new Vector2(this.x + rh.x, this.y + rh.y);
  }

  add(rh: Vector2) {
    this.x += rh.x;
    this.y += rh.y;
  }

  subtract(rh: Vector2) {
    return new Vector2(this.x - rh.x, this.y - rh.y);
  }

  sumScalar(val: number) {
    return new Vector2(this.x + val, this.y + val);
  }

  multiply(val: number) {
    return new Vector2(this.x * val, this.y * val);
  }

  divide(val: number) {
    return new Vector2(this.x / val, this.y / val);
  }

  rotate(radians: number) {
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);

    return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }
}
