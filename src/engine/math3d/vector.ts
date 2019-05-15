
export class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static clone(vec: Vector) {
    return new Vector(vec.x, vec.y, vec.z);
  }

  dot(rh: Vector) {
    return this.x * rh.x + this.y * rh.y + this.z * rh.z;
  }

  cross(rh: Vector) {
    return new Vector(
      this.y * rh.z - this.z * rh.y,
      this.z * rh.x - this.x * rh.z,
      this.x * rh.y - this.y * rh.x
    );
  }

  magnitudeSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSq());
  }

  distanceSq(rh: Vector) {
    return this.subtract(rh).magnitudeSq();
  }

  distance(rh: Vector) {
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
    this.z /= norm;
  }

  setMagnitude(mag: number) {
    this.normalize();
    this.x *= mag;
    this.y *= mag;
    this.z *= mag;
  }

  sum(rh: Vector) {
    return new Vector(this.x + rh.x, this.y + rh.y, this.z + rh.z);
  }

  add(rh: Vector) {
    this.x += rh.x;
    this.y += rh.y;
    this.z += rh.z
  }

  subtract(rh: Vector) {
    return new Vector(this.x - rh.x, this.y - rh.y, this.z - rh.z);
  }

  sumScalar(val: number) {
    return new Vector(this.x + val, this.y + val, this.z + val);
  }

  multiply(val: number) {
    return new Vector(this.x * val, this.y * val, this.z * val);
  }

  divide(val: number) {
    return new Vector(this.x / val, this.y / val, this.z / val);
  }

  rotate(radians: number) {
    return this.rotateZ(radians);
  }

  rotateZ(radians: number) {
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);

    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos, this.z);
  }

  angle() {
    return this.angleZ();
  }

  angleZ() {
    return Math.atan2(this.y, this.x);
  }
}
