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

  angle() {
    return Math.atan2(this.y, this.x);
  }
}

export class Convert {

  //AU per Light Year
  static au_ly: number = 63241.077;

  //KM per AU
  static km_au: number = 149597870.7;

  //Degrees-Radians ratio
  static deg_rad: number = Math.PI / 180;

  //seconds per day
  static seconds_day: number = 60 * 60 * 24;

  //Universal Gravitation Constant
  static G: number = 6.67408e-11;

  //Light Years to AU
  static LYtoAU(ly: number) {
    return ly * Convert.au_ly;
  }

  static AUtoLY(au: number) {
    return au / Convert.au_ly;
  }

  static KMtoAU(km: number) {
    return km / Convert.km_au;
  }

  static AUtoKM(au: number) {
    return au * Convert.km_au;
  }

  static DegreesToRad(d: number) {
    return d * Convert.deg_rad;
  }

  static RadToDegrees(r: number) {
    return r / Convert.deg_rad;
  }

  static DaysToSeconds(d: number) {
    return d * 24 * 60 * 60;
  }
}
