/*
  3D Math Library: Vectors, Matricies, etc
*/

export class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
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

  normalized() {
    let norm = this.magnitude();
    return this.divide(norm);
  }

  sum(rh: Vector) {
    return new Vector(this.x + rh.x, this.y + rh.y, this.z + rh.z);
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
}

//Like a vector 3, but less
export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  magnitudeSq() {
    return this.x * this.x + this.y * this.y;
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSq());
  }

  normalized() {
    let norm = this.magnitude();
    return this.divide(norm);
  }

  sum(rh: Vector2) {
    return new Vector2(this.x + rh.x, this.y + rh.y);
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
}

export class Math3D {}
