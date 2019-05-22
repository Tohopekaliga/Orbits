import { Orbiter } from './orbiter';
import { Vector, Convert } from '../math3d';
import { PointMass } from './point-mass';

enum VesselState {
  Orbiting,     //kepler orbit, using elements
  Maneuvering,  //overriding orbital motion via thrust
  Teathered,    //clamped to parent body position/velocity
  Coasting      //computing gravitational effects
}

export class Vessel extends Orbiter {
  acceleration:number = 1; //m/ss
  maxAccel: Vector;
  maxVel: number = 5e4; //m/s, relative to  target

  targetBody:PointMass;
  targetDistance: number;

  state:VesselState = VesselState.Orbiting;

  goToBody(body:PointMass) {
    //Would be wise to do some planning here if doing
    //a proper trajectory.

    if (this == body) {
      return;
    }

    this.targetBody = body;

    if (this.targetBody) {
      this.state = VesselState.Maneuvering;
    }
    else {
      this.state = VesselState.Coasting;

      //some trickery to make unpowered flight feel less weird (because scifi engines)

      let altitude = Convert.KMtoAU(this.position.magnitude() / 1000);
      altitude = Math.max(altitude, 1.1) ** 2;
        this.velocity.setMagnitude(this.velocity.magnitude() / altitude);
    }

  }

  protected enterOrbit() {

    if(this.targetBody.mass == 0) {
      //a body with no set mass can't be orbited properly, so...just sit on position.
      this.parent = this.targetBody;
      this.state = VesselState.Teathered;

    } else {
      //force a circular orbit
      let relativePos = this.position.subtract(this.parent.position);
      this.a = relativePos.magnitude();
      this.e = 1e-7;
      this.i = 0;
      this.l = 0;
      this.w = relativePos.angle();
      this.M = 0;

      if(this.a < this.parent.radius) {
        this.a = this.parent.radius * 2;
      }
      this.state = VesselState.Orbiting;
    }

    this.calculateOrbit();
    this.calculateVectors();


  }

  updateSOI() {
    //infinity is the Primary, so check destination
    if (this.parent.soi === Infinity) {
      if (this.targetBody.soi && this.targetDistance <= this.targetBody.soi) {
        this.parent = this.targetBody;
      }
    }
    else {
      let parentDistance = this.position.subtract(this.parent.position).magnitudeSq();

      if (parentDistance > this.parent.soi ** 2) {
        this.parent = this.parent.parent;
      }
    }
  }

  update(dt: number) {

    switch (this.state) {
      case VesselState.Orbiting: {
        super.update(dt);
        break;
      }
      case VesselState.Maneuvering: {

        if (this.updateApproach(dt))
          return;

        //let gravity work its magic.
        this.gravitationalAcceleration(dt);
        this.position.add(this.velocity.multiply(dt));

        this.updateSOI();

        break;
      }
      case VesselState.Teathered: {
        this.position = Vector.clone(this.parent.position);
        this.velocity = Vector.clone(this.parent.velocity);
        break;
      }
      case VesselState.Coasting: {
        this.gravitationalAcceleration(dt);
        this.position.add(this.velocity.multiply(dt));
        console.log(this);
        this.recalcElements();
        console.log(this);
        this.state = VesselState.Orbiting;
        break;
      }
      default: {
        console.log("Unknown Vessel State for " + this.name, this.state);
        this.state = VesselState.Orbiting;
        break;
      }
    }

  }

  protected updateApproach(dt:number) {


    let approach = this.targetBody.position.subtract(this.position);
    this.targetDistance = approach.magnitude();
    let mvS = this.maxVel ** 2;

    //scifi engines, perfect acceleration. Way easier math.
    let speed = this.maxVel;
    if(this.targetDistance < this.maxVel * dt) {
      //now arriving...

      //speed = this.targetDistance / dt;

      approach.setMagnitude(50000);
      this.position = this.targetBody.position.subtract(approach);
      this.targetDistance = 0;

      this.updateSOI();
      this.enterOrbit();

      this.targetBody = null;
      return true;
      
    }

    this.velocity = approach.multiply(speed / this.targetDistance);

    return false;
  }
}
