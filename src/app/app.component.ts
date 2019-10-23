import { Component, ViewChild, OnInit } from "@angular/core";
import { HostListener } from "@angular/core";
import { Vector2 } from "../engine/math3d";
import { GameComponent } from './game/game.component';

var mainComponent;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  center: Vector2 = new Vector2(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  area: Vector2 = new Vector2(
    window.innerWidth,
    window.innerHeight
  );

  @ViewChild("game", { static: true }) game: GameComponent;

  constructor() { }


  ngOnInit() { }
  
  onPinchStart(event) {
    this.game.startPinch(event);
  }

  onPinchEnd(event) {
    this.game.endPinch(event);
  }

  onPinch(event) {
    this.game.pinch(event);
  }

  onScroll(event) {
    this.game.scroll(event);
  }

  onPanStart(event) {
    this.game.startPan(event);
  }

  onPan(event) {
    this.game.pan(event);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.center.x = window.innerWidth / 2;
    this.center.y = window.innerHeight / 2;
    this.area.x = window.innerWidth;
    this.area.y = window.innerHeight;
    
    this.game.doSingleRender();
  }
}
