import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from "@angular/core";
import { HostListener } from "@angular/core";
import { CelestialBody } from "./physics/celestial-body";
import { OrbitalGroup } from "./physics/orbital-group";
import { SystemRenderer } from "./engine/system-renderer";
import Sol from "../assets/sol.json";

var mainComponent;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = "Space";
  center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  area = {
    x: window.innerWidth,
    y: window.innerHeight
  };

  // @ts-ignore syntactic sugar warning
  @ViewChild("systemCanvas") canvasRef: ElementRef;
  renderer: SystemRenderer = null;

  solSystem: OrbitalGroup[] = null;

  //the data provided by JPL causes this constant.
  dayStep = (2 * Math.PI) / 365;
  paused: boolean = true;

  simDate = new Date();

  scale = 100;
  pinchScale = 100;
  pinching = false;

  maxScale = 225;
  minScale = 2.25;

  panPoint = { x: 0, y: 0 };

  daysPerSecond = 7;

  lastUpdate: number;
  frameTimer: number;
  frameCounter: number;
  fps: number;

  selectedBody = null;
  totalBodies: number;

  bodyColors = {
    planets: "green",
    mainBelt: "grey",
    comets: "blue",
    tno: "silver"
  };

  constructor() {
    this.solSystem = [];
    this.solSystem.push(new OrbitalGroup("planets", "green", 4, true));
    this.solSystem.push(new OrbitalGroup("mainBelt", "grey", 3));
    this.solSystem.push(new OrbitalGroup("comets", "blue", 3));
    this.solSystem.push(new OrbitalGroup("tno", "silver", 2));

    this.totalBodies = 0;
    for (let g = 0; g < this.solSystem.length; g++) {
      let groupName = this.solSystem[g].name;
	  
	  let groupData = Sol[groupName];

      for (let c = 0; c < groupData.length; c++) {
        this.solSystem[g].addEntity(
          new CelestialBody(
            groupData[c].name,
            groupData[c].e,
            groupData[c].a,
            groupData[c].w,
            groupData[c].M
          )
        );
      }

      this.totalBodies += groupData.length;
    }
	
  }

  ngOnInit() {
    mainComponent = this;
  }

  ngAfterViewInit() {
    var ctx = this.canvasRef.nativeElement.getContext("2d");
    this.renderer = new SystemRenderer(ctx);

    this.render();
  }

  resume() {
    this.lastUpdate = Date.now();
    this.frameTimer = 0;
    this.frameCounter = 0;
    requestAnimationFrame(mainLoop);
  }

  pause() {
    this.paused = !this.paused;

    if (!this.paused) {
      this.resume();
    }
  }

  toggle(group) {
    group.updating = !group.updating;
  }

  onPinchStart(event) {
    this.pinchScale = this.scale;
    this.pinching = true;
  }

  onPinchEnd(event) {
    this.pinching = false;
  }

  onPinch(event) {
    if (this.pinching) {
      this.scale = this.pinchScale * event.scale;

      this.clampScale();
    }

    if (this.paused)
      this.render();
  }

  onScroll(event) {
    let delta = event.deltaY;

    if (delta > 0) {
      this.scale /= delta;
    } else {
      this.scale *= -delta;
    }

    this.clampScale();

    if (this.paused)
      this.render();
  }

  onPanStart(event) {
    this.panPoint.x = this.center.x;
    this.panPoint.y = this.center.y;
  }

  onPan(event) {
    this.center.x = this.panPoint.x + event.deltaX;
    this.center.y = this.panPoint.y + event.deltaY;

    if (this.paused)
      this.render();
  }

  protected clampScale() {
    if (this.scale > this.maxScale) {
      this.scale = this.maxScale;
    } else if (this.scale < this.minScale) {
      this.scale = this.minScale;
    }
  }

  select(planet) {
    this.selectedBody = planet;
  }

  update() {
    let currentTime = Date.now();
    let dt = currentTime - this.lastUpdate;

    this.simDate = new Date(
      this.simDate.getTime() + (dt / this.dayStep) * 24 * 60 * 60
    );

	//change dt to seconds.
    dt = dt / 1000;
    this.lastUpdate = currentTime;

    for (let group of this.solSystem) {
      group.update(dt);
    }

    this.frameCounter++;
    this.frameTimer += dt;

    if (this.frameTimer > 1) {
      this.fps = this.frameCounter;
      this.frameCounter = 0;
      this.frameTimer -= 1;
    }
  }

  render() {

    this.renderer.setDimensions(
      this.center.x,
      this.center.y,
      this.area.x,
      this.area.y,
      this.scale
    );

    this.renderer.clear();
    this.renderer.drawStar();

    for (let group of this.solSystem) {
      this.renderer.drawGroup(group);
    }
  }
  

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.center.x = window.innerWidth / 2;
    this.center.y = window.innerHeight / 2;
    this.area.x = window.innerWidth;
    this.area.y = window.innerHeight;
  }
}

function mainLoop() {
  if (!mainComponent.paused) {
    mainComponent.update();
    mainComponent.render();
    requestAnimationFrame(mainLoop);
  }
}
