import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SystemRenderer } from 'src/engine/render/system-renderer';
import { Convert, Vector2 } from 'src/engine/math3d';
import { StarSystem } from 'src/engine/space';
import { PointMass } from 'src/engine/physics';

@Component({
  selector: 'orb-star-system-display',
  templateUrl: './star-system-display.component.html',
  styleUrls: ['./star-system-display.component.css']
})
export class StarSystemDisplayComponent implements AfterViewInit {

  @ViewChild("systemCanvas", { static: true }) canvasRef: ElementRef;
  renderer: SystemRenderer = null;


  @Input() area: Vector2;
  @Input() center: Vector2;
  @Input() scale: number;

  @Input() starSystem: StarSystem;
  @Input() selectedBody: PointMass;

  constructor() { }

  ngAfterViewInit() {
    var ctx = this.canvasRef.nativeElement.getContext("2d");
    this.renderer = new SystemRenderer(ctx);
    this.renderer.setOrbitMaximum(Convert.KMtoAU(30));
    this.renderer.setMoonsMaximum(Convert.KMtoAU(1));

  }

  render() {

    let center = Vector2.clone(this.center);

    if (this.selectedBody)
      center = center.subtract(this.selectedBody.position.multiply(this.scale / (1000 * Convert.km_au)));


    this.renderer.clear();

    this.renderer.setDimensions(
      center.x,
      center.y,
      this.area.x,
      this.area.y,
      Convert.KMtoAU(this.scale / 1000) //scale is effectively "pixels per AU", which is a lot easier to look at for render considerations.
    );

    if (this.selectedBody) {
      this.renderer.drawCelestial(this.selectedBody, "transparent", 6, "white", true);
    }

    this.starSystem.render(this.renderer);

  }
}
