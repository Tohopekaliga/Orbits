import { Orbiter } from './orbiter';
import { Vector2, Convert } from './math3d';
import { PointMass } from './point-mass';

export class Vessel extends Orbiter {
  acceleration:number = 1; //m/ss
  maxAccel: Vector2;
  maxVel: number = 2e6; //m/s, relative to  target

  targetBody: PointMass;

  targetPoint: Vector2;
  targetVelocity: Vector2;

  enterOrbit(body:PointMass) {
    //the vessel needs to sort out how far it needs to travel,
    //then plot a course to follow.
    
    //grab some basic data
    let approach = body.position.subtract(this.position);
    let distance = approach.magnitude();

    //let's assume we can ge there perfectly.
    let timeToTarget = distance / this.maxVel;

    //figure out where the body will be then, and target it
    [this.targetPoint, this.targetVelocity] = body.peekPosition(timeToTarget);

    this.targetBody = body;

  }

  update(dt:number) {
    if (!this.targetPoint) {
      super.update(dt);
    }
    else {

      //let gravity work its magic.
      this.gravitationalAcceleration(dt);

      let approach = this.targetPoint.subtract(this.position);
      let distance = approach.magnitude();

      this.position = this.position.sum(this.velocity.multiply(dt));
    
      this.recalcElements();
    }
  }

  //Be affected by gravity of the parent body
  gravitationalAcceleration(dt:number) {

    let localPosition = this.position.subtract(this.parent.position);
    let altitudeSq = localPosition.magnitudeSq();

    let gravitation = -Convert.G * (this.parent.mass / altitudeSq);

    let gravityMod = localPosition.normalized().multiply(gravitation * dt);

    this.velocity = this.velocity.sum(gravityMod);
  }
}
