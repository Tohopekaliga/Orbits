import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'orb-sim-speed-bar',
  templateUrl: './sim-speed-bar.component.html',
  styleUrls: ['./sim-speed-bar.component.css']
})
export class SimSpeedBarComponent implements OnInit {

  @Input() levels: Array<any>;
  @Input() paused:Boolean;
  @Input() currentLevel:number;

  @Output() speedClick: EventEmitter<number> = new EventEmitter();
  @Output() pauseToggle: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  pause() {
    this.pauseToggle.emit();
  }

  speedChange(val:number) {
    this.speedClick.emit(val);
  }

}
