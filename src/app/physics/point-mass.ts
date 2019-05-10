import { Vector2 } from "./math3d";

//PointMass: A body with mass, radius, position, and velocity.
export interface PointMass {
  position: Vector2;
  velocity: Vector2;
  mass: number;
  radius: number;

  name: string;

  peekPosition(dt:number);
}
