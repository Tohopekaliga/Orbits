import { Orbiter } from './orbiter';
import { Vector2 } from './math3d';
import { PointMass } from './point-mass';

export class Vessel extends Orbiter {
  acceleration:number = 0.5;
  maxAccel: Vector2;

  targetBody: PointMass;

  update(dt) {
    if (!this.targetBody || this.targetBody.position == this.position) {
      super.update(dt);
    }
    else {
      let approachVector = this.targetBody.position.subtract(this.position);

      if (approachVector.magnitudeSq() > this.acceleration * this.acceleration * dt * dt) {
        approachVector = approachVector.normalized().multiply(this.acceleration * dt);
      }

      this.velocity = this.velocity.sum(approachVector);

      this.position = this.position.sum(this.velocity.multiply(dt));

      this.recalcElements();
    }
  }
}
