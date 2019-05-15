import { PointMass } from './point-mass';
import { Vector } from '../math3d';

//As stellar bodies are the center of the computation, they have no orbital parameters.
//Close Binaries, etc should derive from StellarBody (and do their own orbiting within)

export class StellarBody implements PointMass {
  position: Vector;
  velocity: Vector;

  mass: number;
  radius: number;
  //stars are the be-all-end-all in this sim.
  soi:number = Infinity;
  parent:PointMass = null;

  name: string;

  constructor(name:string, mass: number, radius: number) {
    this.position = new Vector();
    this.velocity = new Vector();

    this.mass = mass;
    this.radius = radius;

    this.name = name;
  }

  peekPosition(dt:number) {
    return [Vector.clone(this.position), Vector.clone(this.velocity)];
  }

  update(dt:number) {
    
  }
}
