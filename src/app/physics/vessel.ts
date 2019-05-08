import { Orbiter } from './orbiter';
import { Vector2 } from './math3d';

export class Vessel extends Orbiter {
    acceleration:Vector2;
    maxAccel:Vector2;
}
