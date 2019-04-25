import { Vector2 } from "./math3d";

export class Orbiter {
  /*
e: Eccentricity
a: Semi-Major Axis
i: Inclination
l: longitude of the Ascending Node
w: Argument of Periapsis
v: True Anomaly
M: Mean Anomaly
*/

  e: number = 0;
  a: number = 0;
  i: number = 0;
  l: number = 0;
  w: number = 0;
  v: number = 0;

  M: number = 0;

  position: Vector2;
  velocity: Vector2;

  //computed rate of change for Mean Anomaly (M)
  protected meanRate: number = 0;
  //private essentricAnomaly: number = 0;

  ellipse = {
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0
  };

  constructor(e = 0, a = 0, w = 0, M = 0, i = 0, l = 0) {
    this.e = e;
    this.a = a;
    this.i = i;
    this.l = l;
    this.w = w;

    //JPL provides the data in degrees, convert to radians.
    this.M = (this.M * Math.PI) / 180;
    this.w = (this.w * Math.PI) / 180;

    //this.e = 0.9;

    this.velocity = new Vector2();
    this.position = new Vector2();

    this.calculateOrbit();
    this.calculatePosition();
  }

  update(dt) {
    this.M += this.meanRate * dt;

    while (this.M > 2 * Math.PI) {
      this.M -= 2 * Math.PI;
    }

    while (this.M < 0) {
      this.M += 2 * Math.PI;
    }

    this.calculatePosition();
    //console.log(this.name + ": M:" + this.M + ", v:" + this.v);
  }

  protected calculatePosition() {
    //Eccentricity Vector (angle)
    //E = M + e*(180/pi) * sin(M) * ( 1.0 + e * cos(M) )
    let E =
      this.M +
      this.e *
        //(180 / Math.PI) *
        Math.sin(this.M) *
        (1 + this.e * Math.cos(this.M));

    //radius
    //r = a(1 - e*cos(E))
    //let r = this.a * (1 - this.e * Math.cos(E));
    //tan(v/2) = sqrt((1+e)(1-e)) * tan(E/2)

    //approximation of true anomaly
    this.v =
      this.M +
      (2 * this.e - (this.e * this.e * this.e) / 4) * Math.sin(this.M) +
      1.25 * this.e * this.e;

    //this.v = this.M;

    //r(v) = (a * (1-e^2)) / (1 + e*cos(v))
    let r = (this.a * (1 - this.e * this.e)) / (1 + this.e * Math.cos(this.v));
    //this.v = Math.PI;


    this.position.x = r * Math.cos(this.v);
    this.position.y = r * Math.sin(this.v);
	
    //rotate the position to be oriented with the actual orbit
    this.position = this.position.rotate(this.w);
  }

  //use the orbital elements to compute mean rate & the ellipse drawing parameters
  protected calculateOrbit() {
    //semi-major axis corresponds to radius along apo/peri line
    this.ellipse.rx = this.a;
    //semi-minor axis
    this.ellipse.ry = this.a * Math.sqrt(1 - this.e * this.e);

    this.ellipse.cx = this.e * this.a;
    this.ellipse.cy = 0;
	
	let center = new Vector2(this.ellipse.cx, this.ellipse.cy);
	center = center.rotate(this.w);
	
	this.ellipse.cx = center.x;
	this.ellipse.cy = center.y;

    let period = 2 * Math.PI * Math.sqrt(this.a * this.a * this.a);
    this.meanRate = (2 * Math.PI) / period;
  }

  //overwrite elements based on state vectors
  protected recalcElements() {}
}
