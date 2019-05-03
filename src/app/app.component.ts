import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from "@angular/core";
import { HostListener } from "@angular/core";
import { CelestialBody } from "./physics/celestial-body";
import { OrbitalGroup } from "./physics/orbital-group";
import { SystemRenderer } from "./engine/system-renderer";
import Sol from "../assets/sol.json";
import { isDefined } from '@angular/compiler/src/util';
import { Vector2, Convert } from './physics/math3d';

var mainComponent;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = "Space";
  center: Vector2 = new Vector2(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  area: Vector2 = new Vector2(
    window.innerWidth,
    window.innerHeight
  );

  // @ts-ignore syntactic sugar warning
  @ViewChild("systemCanvas") canvasRef: ElementRef;
  renderer: SystemRenderer = null;

  solSystem: OrbitalGroup[] = null;

  //the data provided by JPL causes this constant.
  dayStep:number = (2 * Math.PI) / 365;
  paused: boolean = true;
  simSpeed: number = 0;

  //TODO: Put this somewhere better
  G: number = 6.67408 * 10e-11; //Gravitational constant

  //base rate of time is approximately 60days/s
  simSpeedFactor:number[] = [
    0,
    1 / 60,
    1 / 14,
    1
  ];

  simDate:Date = new Date();
  stopDate:Date = new Date();
  advancing:boolean = false;

  scale = 100;
  pinchScale = 100;
  pinching = false;

  maxScale = 22500000;
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

        //JPL data defines mass as x * 10e24 kg, and only provides GM (mass * g) for most bodies.
        let mass = groupData[c].mass ? groupData[c].mass * 10e24 : groupData[c].GM / this.G;

        var body = new CelestialBody(
          groupData[c].name ? groupData[c].name : groupData[c].full_name, //some TNOs don't have proper names, but do have designators in the full name.
          groupData[c].e,
          groupData[c].a,
          groupData[c].w,
          groupData[c].ma,
          groupData[c].i,
          groupData[c].l,
          null, //parent body null means the star
          mass,
          groupData[c].radius
        );

        if (isDefined(groupData[c].satellites)) {
          for (let moon of groupData[c].satellites) {
            body.addMoon(new CelestialBody(
              moon.name,
              moon.e,
              Convert.AUtoKM(moon.a), //JPL reports these as km, but we're operating on AU
              moon.w,
              moon.ma,
              moon.i,
              moon.l
            ));
          }
        }

        this.solSystem[g].addEntity(body);
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

  setSimSpeed(speed:number) {
    if (this.paused)
      this.pause();

    this.simSpeed = speed;
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

  onFieldClick(event) {
    //convert the click location to simulation coordinates
    let point = new Vector2(event.center.x - this.center.x, event.center.y - this.center.y).divide(this.scale);

    //minimum click distance is based on scale.
    let closestPlanet = null;
    let closestMag = 10 / this.scale;

    for (let b = 0; b < this.solSystem.length; b++) {
      for (let c = 0; c < this.solSystem[b].entityList.length; c++) {
        let magnitude = point.subtract(this.solSystem[b].entityList[c].position).magnitudeSq();

        if (magnitude < closestMag) {
          closestMag = magnitude;
          closestPlanet = this.solSystem[b].entityList[c];
        }
      }
    }

    if (!closestPlanet) {
      this.deselectBody();
    }

    this.selectedBody = closestPlanet;

    if (this.selectedBody) {
      //reset camera to center: It will be centered on the selected body.
      this.center = this.area.divide(2);
    }

    if (this.paused) {
      this.render();
    }

  }

  deselectBody() {
    if (this.selectedBody) {
      //force the center point to stay where it is.
      this.center = this.area.divide(2).sum(this.selectedBody.position.multiply(this.scale));
      this.selectedBody = null;
    }
  }

  onScroll(event) {
    let delta = Math.min(Math.max(event.deltaY, -2), 2);

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
  
  advance(days:number) {
    this.stopDate = new Date(this.simDate.getTime() + days * 24 * 60 * 60 * 1000);

    this.advancing = true;

    //gotta go fast
    this.setSimSpeed(3);
      
  }
  
  finishAdvance() {
    this.paused = true;
    this.advancing = false;
  }
  
  fpsUpdate(dt) {
    
    this.frameCounter++;
    this.frameTimer += dt;

    if (this.frameTimer > 1000) {
      this.fps = this.frameCounter;
      this.frameCounter = 0;
      this.frameTimer -= 1000;
    }
  }

  update() {
    let currentTime = Date.now();
    let dt = currentTime - this.lastUpdate;
    this.lastUpdate = currentTime;

    this.fpsUpdate(dt);
    
    dt *= this.simSpeedFactor[this.simSpeed];
    
    let newDate = new Date(
      this.simDate.getTime() + (dt / this.dayStep) * 24 * 60 * 60
    );

  	//change dt to seconds.
    dt = dt / 1000;
    
    if(this.advancing && newDate >= this.stopDate)
    {
      this.finishAdvance();
      
      let stopDiff = this.stopDate.getTime() - this.simDate.getTime();
      let stepDiff = newDate.getTime() - this.simDate.getTime();
      
      dt *= stopDiff/stepDiff;
      
      this.simDate = this.stopDate;
    }
    else {
      this.simDate = newDate;
    }
    
    this.updateSystem(dt);

  }
  
  protected updateSystem(dt) {

    for (let group of this.solSystem) {
      group.update(dt);
    }
  }

  render() {

    let center = this.center;

    if (this.selectedBody)
      center = center.subtract(this.selectedBody.position.multiply(this.scale));

    this.renderer.setDimensions(
      center.x,
      center.y,
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
    
    this.render();
  }
}

function mainLoop() {
  if (!mainComponent.paused) {
    mainComponent.update();
    mainComponent.render();
    requestAnimationFrame(mainLoop);
  }
}
