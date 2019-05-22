import { PointMass, StellarBody, OrbitalGroup, Vessel } from './physics';
import { Vector, Vector2 } from './math3d';
import { SystemRenderer } from './render/system-renderer';

//Overall data object holding all bodies in a given Star System (such as Sol)
export class StarSystem {
  star: StellarBody;
  bodies: OrbitalGroup[];
  ships: Vessel[];

  searchList: PointMass[];

  active: boolean;
  timeSinceUpdate: number;

  constructor() {
    this.bodies = [];
    this.ships = [];
    this.searchList = [];

    this.active = true;
    this.timeSinceUpdate = 0;
  }

  update(dt: number) {

    if (!this.active) {
      this.timeSinceUpdate += dt;
    }
    else {
      if(this.timeSinceUpdate)
      {
        dt += this.timeSinceUpdate;
        this.timeSinceUpdate = 0;
      }

      this.star.update(dt);

      for (let group of this.bodies) {
        group.update(dt);
      }

      for (let ship of this.ships) {
        ship.update(dt);
      }

    }
  }

  addShip(ship:Vessel) {
    this.ships.push(ship);
    this.searchList.push()
  }

  pickObject(point:Vector2, leeway:number, selectedBody:any = null, checkMoons:boolean = false) {
    //minimum click distance is roughly 10px
    let closestPlanet = null;
    let closestMag = leeway;

    let point3d = new Vector(point.x, point.y, 0);

    //scale to view Moons. Change this when config is set up for that.
    if(checkMoons && selectedBody && selectedBody != this.star) {
      
      let parentBody = (selectedBody.parent && selectedBody.parent.moons) ? selectedBody.parent : selectedBody;
      
      for(let m = 0; m < parentBody.moons.length; m++) {
        let magnitude = point3d.subtract(parentBody.moons[m].position).magnitudeSq();

        if (magnitude < closestMag) {
          closestMag = magnitude;
          closestPlanet = parentBody.moons[m];
        }
      }
    }

    //clicking the star?
    {
      let magnitude = point3d.subtract(this.star.position).magnitudeSq();
      if (magnitude < closestMag) {
        closestMag = magnitude;
        closestPlanet = this.star;
      }
    }

    for (let b = 0; b < this.bodies.length; b++) {
      for (let c = 0; c < this.bodies[b].entityList.length; c++) {
        let magnitude = point3d.subtract(this.bodies[b].entityList[c].position).magnitudeSq();

        if (magnitude < closestMag) {
          closestMag = magnitude;
          closestPlanet = this.bodies[b].entityList[c];
        }
      }
    }

    //check ships, too
    for (let c = 0; c < this.ships.length; c++) {
      let magnitude = point3d.subtract(this.ships[c].position).magnitudeSq();

      if (magnitude < closestMag) {
        closestMag = magnitude;
        closestPlanet = this.ships[c];
      }
    }

    return closestPlanet;
  }
}
