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
  E: number = 0;

  position: Vector2;
  velocity: Vector2;

  //the body this Orbiter Orbits. If null/invalid, assumed to be the star.
  parent: Orbiter;

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

    //JPL provides the data in degrees, convert to radians.
    this.M = (M * Math.PI) / 180;
    this.w = (w * Math.PI) / 180;
    
    //as the simulation currently uses HTML canvas coordinates, the XY coordinate system is flipped.
    //i > Pi means retrograde
    if(this.i < Math.PI)
    {
      this.w *= -1;
      this.M *= -1;
    }
    this.velocity = new Vector2();
    this.position = new Vector2();

    this.calculateOrbit();
    this.calculatePosition();
  }

  setParent(parent: Orbiter) {
    this.parent = parent;

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
  }

  protected eccentricAnomaly() {
    const epsilon = 0.00001;
    const maxIter = 20;

    //high eccentricity starts at a different value
    let E = (this.e < 0.8) ? this.M : Math.PI;
    let F = E - this.e * Math.sin(this.M) - this.M;

    let i = 0;
    while (Math.abs(F) > epsilon && i < maxIter) {
      E = E - F / (1 - this.e * Math.cos(E));
      F = E - this.e * Math.sin(E) - this.M;
      i++;
    }
    
    return E;
  }

  protected trueAnomaly() {

    //Eccentricity Vector (angle)
    let E = this.eccentricAnomaly();

    let sin = Math.sin(E);
    let cos = Math.cos(E);
    
    return Math.atan2(
      Math.sqrt(1 - this.e * this.e) * sin,
      cos - this.e
    );
  }

  protected calculatePosition() {

    //True anomaly: Where the body really is
    this.v = this.trueAnomaly();

    //r: magnitude of x,y vector to body
    //r(v) = (a * (1-e^2)) / (1 + e*cos(v))
    let r = (this.a * (1 - this.e * this.e)) / (1 + this.e * Math.cos(this.v));

    this.position.x = r * Math.cos(this.v);
    this.position.y = r * Math.sin(this.v);
	
    //rotate the position to be oriented with the actual orbit
    this.position = this.position.rotate(this.w);

    //now shift it into interplanetary coordinates if applicable
    if (this.parent) {
      this.position = this.position.sum(this.parent.position);
    }
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
    
    //invert everything for HTML canvas coordinates.
    if(this.i < Math.PI)
      this.meanRate *= -1;
  }

  //overwrite elements based on state vectors
  protected recalcElements() {}
}
