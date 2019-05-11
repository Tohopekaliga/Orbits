import { Orbiter } from './orbiter';
import { Vector2, Convert } from './math3d';
import { PointMass } from './point-mass';

export class Vessel extends Orbiter {
  acceleration:number = 1; //m/ss
  maxAccel: Vector2;
  maxVel: number = 2e6; //m/s, relative to  target

  targetBody: PointMass;

  update(dt:number) {
    if (!this.targetBody || this.targetBody.position == this.position) {
      super.update(dt);
    }
    else {

      //let gravity work its magic.
      this.gravitationalAcceleration(dt);


      let approachVector = this.targetBody.position.subtract(this.position);
      let distSq = approachVector.magnitudeSq();

      let relativeVel = this.targetBody.velocity.subtract(this.velocity);
      let rvel = relativeVel.magnitude();

      //split acceleration across activities
      let acc = this.acceleration * dt;

      if (rvel > this.maxVel * dt) {

        let difference = rvel - this.maxVel;

        let adjustment = difference > acc ? acc : difference;
        acc -= adjustment;

        this.velocity.sum(relativeVel.normalized().multiply(adjustment));
        
      }
      
      if (acc > 0) {
        let stepAccel = distSq < acc * acc ? Math.sqrt(distSq) : acc;

        approachVector = approachVector.normalized().multiply(stepAccel);
      }

      this.velocity = this.velocity.sum(approachVector);

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
