import { Vector2, Convert } from "../math3d";
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
  soi: number = 0;

  //μ, standard gravitational parameter, G(M+m). Computed with orbit
  GM: number;

  //semi-minor axis
  b: number;

  position: Vector2;
  velocity: Vector2;

  //the body this Orbiter Orbits.
  parent: PointMass;

  name: string;

  //computed rate of change for Mean Anomaly (M)
  protected meanMotion: number = 0;

  ellipse = {
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0
  };

  constructor(name:string = "", e:number = 0, a:number = 0, w:number = 0, M:number = 0, i:number = 0, l:number = 0, parent:PointMass = null, mass:number = 0, radius:number = 0) {
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
    this.name = name;

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

  update(dt:number) {
    this.M += this.meanMotion * dt;

    while (this.M > 2 * Math.PI) {
      this.M -= 2 * Math.PI;
    }

    while (this.M < 0) {
      this.M += 2 * Math.PI;
    }

    this.calculateVectors();
  }
  
  peekPosition(dt:number) {
    let realPos = Vector2.clone(this.position);
    let realVel = Vector2.clone(this.velocity);
    let realM = this.M;

    this.update(dt);

    let ret = [Vector2.clone(this.position), Vector2.clone(this.velocity)];

    this.position = realPos;
    this.velocity = realVel;
    this.M = realM;

    return ret;
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
  
  protected meanAnomalyFromTrue() {
    
    //Eccentric anomaly, computed from e & v
    let E = Math.atan2(Math.sqrt(1 - this.e ** 2) * Math.sin(this.v), this.e + Math.cos(this.v));
    
    //kepler's equation
    this.M = E - this.e * Math.sin(E);
    
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
  
  protected computeGM() {
    
    let mass = this.parent.mass + this.mass;
    this.GM = Convert.G * mass;
  }

  protected computeMeanMotion() {

    //a in meters, M as mass of parent, m as mass of body
    //n = sqrt( G(M+m)/a^3 ), radians/second

    this.computeGM();
    let a_cubed = this.a ** 3;

    //Mean Motion, the total angular change per second for this orbit
    this.meanMotion = Math.sqrt(this.GM / a_cubed);

    //flip rotation direction to account for inverted Y axis.
    if (this.i < Math.PI / 2)
      this.meanMotion *= -1;
  }

  protected calculateVectors() {

    //True anomaly: Where the body really is
    this.v = this.trueAnomaly();
    let cos_v = Math.cos(this.v);
    let sin_v = Math.sin(this.v);

    //r: magnitude of x,y vector to body
    //r(v) = (a * (1-e^2)) / (1 + e*cos(v))
    let r = (this.a * (1 - this.e * this.e)) / (1 + this.e * cos_v);

    let lastPosition = this.position.subtract(this.parent.position);

    this.position.x = r * cos_v;
    this.position.y = r * sin_v;

    //rotate the position to be oriented with the actual orbit
    this.position = this.position.rotate(this.w);



    //Instantaneous velocity: sqrt(μ*(2/r - 1/a))
    let a = this.a;
    let linearVelocity = Math.sqrt(this.GM * (2 / r - 1 / a));

    //TODO: Figure out the correct math to compute velocity without lastPosition.
    //tangent vector
    //sqrt(sinv^2 * a^2 + cosv^2 * b^2)
    /*let velocity_denominator = Math.sqrt(sin_v* sin_v * this.a * this.a + cos_v * cos_v * this.b * this.b);
    
    let tangent = new Vector2(-(sin_v * this.a) / velocity_denominator, (cos_v * this.b) / velocity_denominator);
    tangent = tangent.sum(this.position);

    this.velocity = tangent.normalized().multiply(linearVelocity);*/
    this.velocity = this.position.subtract(lastPosition).normalized().multiply(linearVelocity);

    //now shift it into interplanetary coordinates if applicable
    this.position = this.position.sum(this.parent.position);
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
  protected recalcElements() {
  
    this.computeGM();

    let speedSq = this.velocity.magnitudeSq();
    let altitude = this.position.magnitude();
    
    let evec = this.position
      .multiply(speedSq - this.GM / altitude)
      .subtract(this.velocity.multiply(this.position.dot(this.velocity)))
      .divide(this.GM);

    this.e = evec.magnitude();
    
    let mechE = speedSq / 2 - this.GM / altitude;
    
    this.a = -this.GM / 2 * mechE;
    
    this.w = Math.acos(evec.x / evec.magnitude());
    
    this.v = Math.acos(evec.dot(this.position) / this.e * altitude);
    
    this.meanAnomalyFromTrue();
    
    this.calculateOrbit();

  }
}
