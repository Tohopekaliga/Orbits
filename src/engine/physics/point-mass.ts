import { Vector } from "../math3d";

//PointMass: A body with mass, radius, position, and velocity.
export interface PointMass {
  position: Vector;
  velocity: Vector;
  mass: number;
  radius: number;
  soi:number;
  parent:PointMass;

  name: string;

  update(dt:number);
  peekPosition(dt:number);
}
