import { Orbiter } from './orbiter';
import { Vector2, Convert } from './math3d';
import { PointMass } from './point-mass';

export class Vessel extends Orbiter {
  acceleration:number = 1;
  maxAccel: Vector2;
  //maxVel: 1; //1 AU/day is roughly 0.005 C

  targetBody: PointMass;

  update(dt) {
    if (!this.targetBody || this.targetBody.position == this.position) {
      super.update(dt);
    }
    else {
      let approachVector = this.targetBody.position.subtract(this.position);
      let distSq = approachVector.magnitudeSq();
      let accSq = this.acceleration ** 2;

      let relativeVel = this.targetBody.velocity.subtract(this.velocity);
      let rvel = relativeVel.magnitude();

      let acc = this.acceleration;
      /*
      if(rvel > Math.sqrt(distSq) * 4) {
        //cut back on relative velocity
        this.velocity.sum(relativeVel.normalized().multiply(acc/2));

        acc /= 2;
      }*/

      let stepAccel = distSq < acc*acc ? Math.sqrt(distSq) : acc;
      stepAccel *= dt;

      approachVector = approachVector.normalized().multiply(stepAccel);



      //if (approachVector.magnitudeSq() > this.acceleration * this.acceleration * dt * dt) {
      //  approachVector = approachVector.normalized().multiply(this.acceleration * dt);
      //}

      this.gravitationalAcceleration(dt);
      this.velocity = this.velocity.sum(approachVector);

      this.position = this.position.sum(this.velocity.multiply(dt));
      
      this.recalcElements();
    }
  }

  //Be affected by gravity of the parent body
  gravitationalAcceleration(dt) {

    let localPosition = this.position.subtract(this.parent.position);
    let altitudeSq = localPosition.magnitudeSq();

    let gravitation = -Convert.G * (this.parent.mass / altitudeSq);

    let gravityMod = localPosition.normalized().multiply(gravitation * dt);

    this.velocity = this.velocity.sum(gravityMod);
  }
}
