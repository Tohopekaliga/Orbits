import { Component, Input } from '@angular/core';

@Component({
  selector: 'orb-scale-indicator',
  templateUrl: './scale-indicator.component.html',
  styleUrls: ['./scale-indicator.component.css']
})
export class ScaleIndicatorComponent {

  protected trueScale;
  displayScale;

  @Input()
  set scale(scale: number) {
    this.trueScale = scale;

    this.displayScale = scale;
  }

  get scale(): number {
    return this.trueScale;
  }

  constructor() { }

}
