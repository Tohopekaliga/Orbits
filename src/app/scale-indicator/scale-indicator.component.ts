import { Component, Input } from '@angular/core';
import { Convert } from '../../engine/math3d';

@Component({
  selector: 'orb-scale-indicator',
  templateUrl: './scale-indicator.component.html',
  styleUrls: ['./scale-indicator.component.css']
})
export class ScaleIndicatorComponent {

  protected trueScale;
  displayScale;
  displayValue:number = 1;
  displayUnit:string = "AU";
  
  maxWidth:number = 250; //px
  minWidth:number = 40;

  @Input()
  set scale(scale: number) {
    this.trueScale = scale;
    this.computeDisplay();
  }

  get scale(): number {
    return this.trueScale;
  }

  protected computeDisplay() {

    //as the trueScale value corresponds to pixels per AU,
    //keep the bar from getting too big or too small.

    if(this.trueScale > this.maxWidth) {
      
      this.displayScale = this.maxWidth;

      let fraction = this.displayScale / this.trueScale;

      if(this.trueScale > this.maxWidth * 2) {
        this.displayValue = Math.floor(Convert.AUtoKM(fraction));
        this.displayUnit = "km";
      }
      else {
        this.displayValue = fraction;
        this.displayUnit = "AU";
      }

    }
    else if(this.trueScale < this.minWidth) {

      let au = Math.ceil(this.minWidth / this.trueScale);

      this.displayScale = au * this.trueScale;

      this.displayValue = au;
      this.displayUnit = "AU";
    }
    else {
      this.displayScale = this.trueScale;
      this.displayValue = 1;
      this.displayUnit = "AU";
    }

  }

  constructor() { }

}
