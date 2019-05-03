import { Orbiter } from "../physics/orbiter";
import { OrbitalGroup } from "../physics/orbital-group";
import { CelestialBody } from '../physics/celestial-body';
import { Vector2 } from '../physics/math3d';

export class SystemRenderer {
  ctx: CanvasRenderingContext2D;

  dimensions = {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  };

  scale: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;;
  }

  setDimensions(
    cx: number,
    cy: number,
    width: number,
    height: number,
    scale: number = 1
  ) {
    this.dimensions.cx = cx;
    this.dimensions.cy = cy;
    this.dimensions.width = width;
    this.dimensions.height = height;
    this.scale = scale;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
  }
  
  drawOrbit(body:Orbiter) {
	this.ctx.beginPath();
	this.ctx.ellipse(
		this.dimensions.cx - body.ellipse.cx * this.scale,
		this.dimensions.cy - body.ellipse.cy * this.scale,
		body.ellipse.rx * this.scale,
		body.ellipse.ry * this.scale,
		body.w,
		0,
		2 * Math.PI
	);
	this.ctx.strokeStyle = "grey";
	this.ctx.stroke();
		
  }

  drawBodyWithMoons(body: CelestialBody, color: string = "blue", size: number = 4) {
    this.drawCelestial(body, color, size);

    if (this.scale > 200) {
      for (let moon of body.moons) {
        this.drawCelestial(moon, color, size - 1);
      }
    }
  }

  drawCelestial(body: Orbiter, color:string = "blue", size:number = 4) {
    this.ctx.beginPath();
    this.ctx.arc(
      this.dimensions.cx + body.position.x * this.scale,
      this.dimensions.cy + body.position.y * this.scale,
      size,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.strokeStyle = "navy";
    this.ctx.stroke();
  }
  
  drawGroup(group:OrbitalGroup) {
	  
	  for (let body of group.entityList) {
		  if(group.paths) {
			  this.drawOrbit(body);
        }
        this.drawBodyWithMoons(body, group.color, group.drawSize);
	  }
  }

  drawStar() {
    this.ctx.beginPath();
    this.ctx.arc(this.dimensions.cx, this.dimensions.cy, 5, 0, 2 * Math.PI);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();
  }
}
