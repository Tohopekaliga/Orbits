import { PointMass } from './point-mass';
import { Vector2 } from './math3d';

//As stellar bodies are the center of the computation, they have no orbital parameters.
//Close Binaries, etc should derive from StellarBody (and do their own orbiting within)

export class StellarBody implements PointMass {
  position: Vector2;
  velocity: Vector2;

  mass: number;
  radius: number;

  name: string;

  constructor(name:string, mass: number, radius: number) {
    this.position = new Vector2();
    this.velocity = new Vector2();

    this.mass = mass;
    this.radius = radius;

    this.name = name;
  }
}
