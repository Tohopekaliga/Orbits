import { Vector2, Convert } from "./math3d";
import { PointMass } from './point-mass';
import { isNull } from 'util';

export class Orbiter implements PointMass {
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

  n: number = 0;

  mass: number = 0;
  radius: number = 0;

  //μ, standard gravitational parameter, G(M+m). Computed with orbit
  GM: number;

  //semi-minor axis
  b: number;

  position: Vector2;
  velocity: Vector2;

  //the body this Orbiter Orbits.
  parent: PointMass;

  //computed rate of change for Mean Anomaly (M)
  protected meanMotion: number = 0;

  ellipse = {
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0
  };

  constructor(e:number = 0, a:number = 0, w:number = 0, M:number = 0, i:number = 0, l:number = 0, parent:PointMass = null, mass:number = 0, radius:number = 0) {
    this.e = e;
    this.a = a;

    //JPL provides the data in degrees, convert to radians.
    this.M = Convert.DegreesToRad(M);
    this.w = Convert.DegreesToRad(w);
    this.i = Convert.DegreesToRad(i);
    this.l = Convert.DegreesToRad(l);

    //as the simulation currently uses HTML canvas coordinates, the XY coordinate system is flipped.
    //i > Pi/2 means retrograde
    if (this.i < Math.PI / 2) {
      this.w *= -1;
      this.M *= -1;
    }

    this.mass = mass;
    this.radius = radius;

    this.parent = parent;

    this.velocity = new Vector2();
    this.position = new Vector2();

    this.calculateOrbit();
    this.calculateVectors();
  }

  setParent(parent: PointMass) {

    if(this.parent != parent) {
      this.parent = parent;

      this.calculateOrbit();
      this.calculateVectors();
    }
  }

  setMeanMotion(n:number) {
    this.n = n;
    this.calculateOrbit();
  }

  update(dt) {
    this.M += this.meanMotion * dt;

    while (this.M > 2 * Math.PI) {
      this.M -= 2 * Math.PI;
    }

    while (this.M < 0) {
      this.M += 2 * Math.PI;
    }

    this.calculateVectors();
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

  protected computeMeanMotion() {

    //a in meters, M as mass of parent, m as mass of body
    //n = sqrt( G(M+m)/a^3 ), radians/second

    let a = Convert.AUtoKM(this.a) * 1000;
    let mass = this.parent.mass + this.mass;
    this.GM = Convert.G * mass;
    let a_cubed = a * a * a;

    //Mean Motion in days
    this.meanMotion = Math.sqrt(this.GM / a_cubed) * 60 * 60 * 24;

    //flip rotation direction to account for inverted Y axis.
    if (this.i < Math.PI / 2)
      this.meanMotion *= -1;
  }

  protected calculateVectors() {

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


    //Instantaneous velocity: sqrt(μ*(2/r - 1/a))
    let a = Convert.AUtoKM(this.a) * 1000;
    let v = Math.sqrt(this.GM * (2 / r - 1 / a));

    //TODO
    //tangent vector
    //this will need gravity applied to it for proper motion,
    //but base Orbiter does not use this for position calculation
    

  }

  //use the orbital elements to compute mean rate & the ellipse drawing parameters
  protected calculateOrbit() {
    //semi-major axis corresponds to radius along apo/peri line
    this.ellipse.rx = this.a;
    //semi-minor axis
    this.b = this.a * Math.sqrt(1 - this.e * this.e);
    this.ellipse.ry = this.b;

    this.ellipse.cx = this.e * this.a;
    this.ellipse.cy = 0;

    let center = new Vector2(this.ellipse.cx, this.ellipse.cy);
    center = center.rotate(this.w);

    this.ellipse.cx = center.x;
    this.ellipse.cy = center.y;

    this.computeMeanMotion();

  }

  //overwrite elements based on state vectors
  protected recalcElements() { }
}
