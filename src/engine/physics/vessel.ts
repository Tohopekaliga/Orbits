import { Orbiter } from './orbiter';
import { Vector2, Convert } from './math3d';
import { PointMass } from './point-mass';


export class Vessel extends Orbiter {
  acceleration:number = 1; //m/ss
  maxAccel: Vector2;
  maxVel: number = 2e5; //m/s, relative to  target

  targetBody:PointMass;
  targetDistance:number;

  goToBody(body:PointMass) {
    //Would be wise to do some planning here if doing
    //a proper trajectory.

    this.targetBody = body;

  }

  updateSOI() {
    //infinity is the Primary, so check destination
    if(this.parent.soi === Infinity) {
      if(this.targetBody.soi && this.targetDistance <= this.targetBody.soi) {
        this.parent = this.targetBody;
      }
    }
    else {
      let parentDistance = this.position.subtract(this.parent.position).magnitudeSq();

      if(parentDistance > this.parent.soi ** 2) {
        this.parent = this.parent.parent;
      }
    }
  }

  protected enterOrbit() {

    if(this.targetBody.mass == 0) {
      //a body with no set mass can't be orbited properly, so...just sit on position.
      //TODO: DO THIS A BETTER WAY, OMG
      // @ts-ignore conversion
      let orbital:Orbiter = this.targetBody;
      this.a = orbital.a;
      this.e = orbital.e;
      this.i = orbital.i;
      this.l = orbital.l;
      this.w = orbital.w;
      this.M = orbital.mass;
      this.v = orbital.v;
    } else {

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
    }
    console.log(this.targetBody, this);
    this.calculateOrbit();
    this.calculateVectors();


  }

  update(dt:number) {
    if (!this.targetBody) {
      super.update(dt);
    }
    else {

      if(this.updateApproach(dt))
        return;
      
      //let gravity work its magic.
      this.gravitationalAcceleration(dt);

      this.position.add(this.velocity.multiply(dt));

      this.updateSOI();
    
      this.recalcElements();
    }
  }

  //Be affected by gravity of the parent body
  gravitationalAcceleration(dt:number) {

    let localPosition = this.position.subtract(this.parent.position);
    let altitudeSq = localPosition.magnitudeSq();

    let gravitation = -Convert.G * (this.parent.mass / altitudeSq);

    let gravityMod = localPosition.normalized().multiply(gravitation * dt);

    this.velocity.add(gravityMod);
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