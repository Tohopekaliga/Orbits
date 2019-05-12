import { CelestialBody } from './celestial-body';

//orbital groups can be used to hold onto a bunch of orbital objects and handle blah blah

export class OrbitalGroup {
  //if false, will collect timesteps passed in, but not update child objects.
  //to allow for skipping unnecessary processing like calculating the exact
  //position of bodies in another star system.
  updating: boolean = true;

  entityList: CelestialBody[] = [];

  name: string;
  color: string;
  orbitColor: string;
  paths: boolean;
  drawSize:number;

  protected timeSinceUpdate: number = 0;

  constructor(
    name: string = "",
    color: string = "red",
	  drawSize: number = 4,
    paths: boolean = false,
    orbitColor: string = "grey"
  ) {
    this.name = name;
    this.color = color;
    this.paths = paths;
    this.drawSize = drawSize;
    this.orbitColor = orbitColor;
  }

  update(dt: number): void {
    this.timeSinceUpdate += dt;
    if (this.updating) {
      for (let c = 0; c < this.entityList.length; c++) {
        this.entityList[c].update(this.timeSinceUpdate);
      }

      this.timeSinceUpdate = 0;
    }
  }

  addEntity(obj: CelestialBody): void {
    this.entityList.push(obj);
  }
}
