import { Orbiter } from "./orbiter";

export class CelestialBody extends Orbiter {
  name: string = "";
  color: string = "";

  moons: CelestialBody[];

  constructor(name: string, e = 0, a = 0, w = 0, M = 0, i = 0, l = 0) {
    super(e, a, w, M, i, l);

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
