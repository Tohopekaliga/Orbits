import { Orbiter } from "./orbiter";
import { PointMass } from "./point-mass";
import { Vector2 } from './math3d';

export class CelestialBody extends Orbiter {

  moons: CelestialBody[];

  soi:number;

  constructor(name: string, e: number = 0, a: number = 0, w: number = 0, M: number = 0,
    i: number = 0, l: number = 0, parent: PointMass = null, mass: number = 0, radius: number = 0) {

    super(name, e, a, w, M, i, l, parent, mass, radius);

    this.soi = this.a * Math.pow(this.mass / parent.mass, 2/5);
 
    this.moons = [];

  }

  addMoon(moon: CelestialBody) {

    moon.setParent(this);
    this.moons.push(moon);
  }

  update(dt:number) {

    super.update(dt);

    for (let moon of this.moons) {
      moon.update(dt);
    }
  }

}
