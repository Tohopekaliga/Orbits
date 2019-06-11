import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Convert, Vector2 } from 'src/engine/math3d';
import { StarSystem } from 'src/engine/space';
import { PointMass } from 'src/engine/physics';
import { StarSystemDisplayComponent } from '../star-system-display/star-system-display.component';
import { LoadGameService } from '../data-services/load-game.service';

var mainComponent;

@Component({
  selector: 'orb-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Input() center: Vector2 = new Vector2();
  @Input() area: Vector2 = new Vector2();
  
  @ViewChild("systemDisplay") systemDisplay: StarSystemDisplayComponent;

  solSystem: StarSystem;
  systemReady: boolean = false;

  contextMenuText: string = "";
  contextMenuPos: Vector2 = new Vector2();
  showContextMenu: boolean = false;
  contextSelected: PointMass = null;

  lastUpdate: number;

  paused: boolean = true;
  simSpeed: number = 0;
  frameId: number = 0;

  simSpeedFactor: number[] = [
    1, //real time
    60 * 60, //hr/sec
    Convert.DaystoSec(1),    //day/sec
    Convert.DaystoSec(7),    //wk/sec
    Convert.DaystoSec(30),   //mnth/sec
    Convert.DaystoSec(60),   //yep
  ];

  //JPL data specifies 1 January, 2000 at 12 noon.
  startDate: Date = new Date(2000, 1, 1, 12, 0, 0, 0);

  simDate: Date = new Date();
  stopDate: Date = new Date();
  advancing: boolean = false;

  frameCounter: number = 0;
  frameTimer: number = 0;
  fps: number = 0;

  scale = 100;
  pinchScale = 100;
  pinching = false;

  maxScale = 22500000;
  minScale = 2.25;

  panPoint = new Vector2();

  selectedBody = null;
  systemBodyList: PointMass[] = [];
  searchResults: PointMass[] = [];

  constructor(private loadService: LoadGameService) { }

  ngOnInit() {
    this.simDate = new Date(this.startDate);
    mainComponent = this;
    this.loadSol();
  }

  loadSol() {
    this.loadService.newGame().subscribe((system) => {
      this.solSystem = system;

      //make right now be the game date.
      this.jumpToDate(new Date());

      this.systemReady = true;
      this.doSingleRender();
    });

  }

  jumpToDate(newTime: Date) {
    let dt = newTime.getTime() - this.simDate.getTime();
    dt /= 1000;

    this.simDate = newTime;

    this.updateSystem(dt);
  }

  update() {
    let currentTime = Date.now();
    let dt = currentTime - this.lastUpdate;
    this.lastUpdate = currentTime;

    this.fpsUpdate(dt);

    dt *= this.simSpeedFactor[this.simSpeed];

    let newDate = new Date(this.simDate.getTime() + dt);

    //change dt to seconds.
    dt = dt / 1000;

    if (this.advancing && newDate >= this.stopDate) {
      this.finishAdvance();

      let stopDiff = this.stopDate.getTime() - this.simDate.getTime();
      let stepDiff = newDate.getTime() - this.simDate.getTime();

      dt *= stopDiff / stepDiff;

      this.simDate = this.stopDate;
    }
    else {
      this.simDate = newDate;
    }

    this.updateSystem(dt);

  }

  protected updateSystem(dt) {

    this.solSystem.update(dt);
  }

  resume() {
    this.lastUpdate = Date.now();
    this.resetFrames();
    requestAnimationFrame(mainLoop);
  }

  pause() {
    this.paused = !this.paused;

    if (!this.paused) {
      this.resume();
    }
  }

  fpsUpdate(dt) {

    this.frameCounter++;
    this.frameTimer += dt;

    if (this.frameTimer > 1000) {
      this.fps = this.frameCounter;
      this.frameCounter = 0;
      this.frameTimer = 0;
    }
  }

  resetFrames() {
    this.frameCounter = 0;
    this.frameTimer = 0;
  }

  advance(days: number) {
    this.stopDate = new Date(this.simDate.getTime() + days * 24 * 60 * 60 * 1000);

    this.advancing = true;

    //gotta go fast
    this.setSimSpeed(this.simSpeedFactor.length - 1);

  }

  finishAdvance() {
    this.paused = true;
    this.advancing = false;
  }

  setSimSpeed(speed: number) {
    if (this.paused)
      this.pause();

    this.simSpeed = speed;
  }

  doSingleRender() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(renderOnce);
    }
  }

  render() {

    this.systemDisplay.render();

  }


  startPinch(event) {
    this.showContextMenu = false;
    this.pinchScale = this.scale;
    this.pinching = true;

    if (!this.selectedBody) {
      this.startPan(event);
    }
  }

  pinch(event) {
    if (this.pinching) {
      this.scale = this.pinchScale * event.scale;

      this.clampScale();

      //if a body is selected, don't pan,
      //otherwise do so.
      if (!this.selectedBody) {
        this.pan(event);
      }
    }

    if (this.paused)
      this.doSingleRender();
  }

  endPinch(event) {
    this.pinching = false;
  }

  scroll(event) {
    this.showContextMenu = false;
    let delta = Math.min(Math.max(event.deltaY, -2), 2);

    if (delta > 0) {
      this.scale /= delta;
    } else {
      this.scale *= -delta;
    }

    this.clampScale();

    if (this.paused)
      this.doSingleRender();
  }

  startPan(event) {
    this.showContextMenu = false;
    this.panPoint.x = this.center.x;
    this.panPoint.y = this.center.y;
  }

  pan(event) {
    if (!this.selectedBody || event.deltaX > 50 || event.deltaY > 50) {

      this.deselectBody();

      this.center.x = this.panPoint.x + event.deltaX;
      this.center.y = this.panPoint.y - event.deltaY;
    }

    if (this.paused)
      this.doSingleRender();
  }

  protected clampScale() {
    if (this.scale > this.maxScale) {
      this.scale = this.maxScale;
    } else if (this.scale < this.minScale) {
      this.scale = this.minScale;
    }
  }

  protected clickSpaceCoord(x: number, y: number): Vector2 {
    //convert the click location to simulation coordinates.
    let point = new Vector2(x - this.center.x, this.area.y - y - this.center.y)
    point = point.multiply(Convert.km_au * 1000 / this.scale);

    if (this.selectedBody) {
      return point.sum(this.selectedBody.position);
    }
    else {
      return point;
    }
  }

  protected pickSpaceObject(x: number, y: number) {
    let point = this.clickSpaceCoord(x, y);

    let leeway = Math.pow(Convert.AUtoKM(10 / this.scale) * 1000, 2);

    return this.solSystem.pickObject(point, leeway, this.selectedBody, true);
  }

  onFieldClick(event) {

    this.showContextMenu = false;

    let pick = this.pickSpaceObject(event.center.x, event.center.y);

    if (!pick && event.tapCount == 1) {
      return;
    }

    this.select(pick);
  }

  onSearch(searchString) {

    if (searchString.length > 2 && this.solSystem)
      this.searchResults = this.solSystem.searchList.filter((body) => { return body.name.includes(searchString); })
    else
      this.searchResults = [];

  }

  select(planet) {
    this.selectedBody = planet;

    if (this.selectedBody) {
      //reset camera to center: It will be centered on the selected body.
      this.center = this.area.divide(2);
    }


    if (this.paused) {
      this.doSingleRender();
    }
  }

  deselectBody() {
    if (this.selectedBody) {
      //force the center point to stay where it is.
      this.center = this.area.divide(2).subtract(this.selectedBody.position.multiply(this.scale));
      this.selectedBody = null;

    }
  }

  systemDisplayContext(x: number, y: number) {

    let pick = this.pickSpaceObject(x, y);

    this.contextMenuText = pick ? pick.name : "(Space)";
    this.contextMenuPos = new Vector2(x, y);
    this.showContextMenu = true;
    this.contextSelected = pick;
  }

  longPress(event) {
    this.systemDisplayContext(event.center.x, event.center.y);
    this.contextMenuPos.y -= 40;
    console.log(event);
  }

  rightClick(event) {
    event.preventDefault();
    this.systemDisplayContext(event.clientX, event.clientY);
  }

  contextGo() {
    this.solSystem.ships[0].goToBody(this.contextSelected);
    this.showContextMenu = false;
  }
}

function renderOnce() {
  mainComponent.frameId = 0;
  mainComponent.render();
}

function mainLoop() {
  if (!mainComponent.paused) {
    mainComponent.update();
    mainComponent.render();
    requestAnimationFrame(mainLoop);
  }
}
