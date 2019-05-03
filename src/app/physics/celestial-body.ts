import { Orbiter } from "./orbiter";

export class CelestialBody extends Orbiter {
  name: string = "";
  color: string = "";

  mass: number;
  radius: number;

  moons: CelestialBody[];

  constructor(name: string, e: number = 0, a: number = 0, w: number = 0, M: number = 0,
    i: number = 0, l: number = 0, parent: Orbiter = null, mass: number = 0, radius: number = 0) {

    super(e, a, w, M, i, l, parent, mass, radius);

    this.name = name;
    this.moons = [];

  }

  addMoon(moon: CelestialBody) {

    moon.setParent(this);
    this.moons.push(moon);
  }

  update(dt) {

    super.update(dt);

    for (let moon of this.moons) {
      moon.update(dt);
    }
  }
}
