import { Orbiter } from './orbiter';
import { Vector2, Convert } from './math3d';
import { PointMass } from './point-mass';


export class Vessel extends Orbiter {
  acceleration:number = 1; //m/ss
  maxAccel: Vector2;
  maxVel: number = 2e5; //m/s, relative to  target

  targetBody:PointMass;

  enterOrbit(body:PointMass) {
    //Would be wise to do some planning here if doing
    //a proper trajectory.

    this.targetBody = body;

  }

  update(dt:number) {
    if (!this.targetBody) {
      super.update(dt);
    }
    else {

      this.updateApproach(dt);
      
      //let gravity work its magic.
      this.gravitationalAcceleration(dt);

      this.position.add(this.velocity.multiply(dt));
    
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
    let distanceSq = approach.magnitudeSq();
    let mvS = this.maxVel ** 2;

    //scifi engines, perfect acceleration. Way easier math.
    let speed = this.maxVel;
    if(distanceSq < mvS) {
      //now arriving...
      this.targetBody = null;

      speed = Math.sqrt(distanceSq);
      //TODO: enter orbit
    }

    this.velocity = approach.normalized().multiply(speed);

  }
}
