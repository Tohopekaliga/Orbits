import { Convert } from '../math3d';
import { TickEvent } from './tick-event';
import { EventEmitter } from 'events';

/**
 * Object to maintain the simulation's current time, and handle events for updates that
 * happen only on certain intervals
 */
export class SimTime extends EventEmitter {

  //The time at the beginning of the game
  startTime: Date;

  //JPL data specifies 1 January, 2000 at 12 noon.
  elementsStart: Date = new Date(2000, 1, 1, 12, 0, 0, 0);

  //Current time in the simulation
  currentTime: Date;

  //Predetermined pause time if performingTimestep == true
  nextPause: Date;
  performingTimestep: Boolean = false;

  protected currentSpeed: number = 1;
  protected simSpeedFactor: number[] = [
    1, //real time
    60 * 60, //hr/sec
    Convert.DaystoSec(1),    //day/sec
    Convert.DaystoSec(7),    //wk/sec
    Convert.DaystoSec(30),   //mnth/sec
    Convert.DaystoSec(60),   //yep
  ];

  get speedFactorCount(): number {
    return this.simSpeedFactor.length;
  }

  paused: Boolean = true;

  tickEvents: TickEvent[];

  constructor() {
    super();


    let now = new Date();

    this.tickEvents = [
      new TickEvent(60 * 60, "hour", now),
      new TickEvent(Convert.DaystoSec(1), "day", now),
      new TickEvent(Convert.DaystoSec(7), "week", now)
    ]
  }

  /**
   * Force set the simulation time without performing standard update operations and reset tick events
   * @param {Date} newTime the new simulation time
   */
  resetTime(newTime:Date) {
    this.currentTime = newTime;

    for (let c = 0; c < this.tickEvents.length; c++) {
      this.tickEvents[c].last = newTime;
    }
  }

  /**
   * Updates the current Sim Time for the number of real miliseconds passed
   * @param {number} dt delta time in miliseconds
   * @return {number} computed delta time in seconds, may be modified by a pause
   */
  update(dt: number) {

    dt *= this.simSpeedFactor[this.currentSpeed];

    let newTime = new Date(this.currentTime.getTime() + dt);

    //change dt to seconds.
    dt = dt / 1000;

    //Handle fixed advance calculation
    if (this.performingTimestep && newTime >= this.nextPause) {
      this.performingTimestep = false;

      let stopDiff = this.nextPause.getTime() - this.currentTime.getTime();
      let stepDiff = newTime.getTime() - this.currentTime.getTime();

      dt *= stopDiff / stepDiff;

      newTime = this.nextPause;

      //this.emit("doneAdvance", this.currentTime);
    }

    //TODO: Figure out how to use nodejs events in frontend
    //emit standard tick
    //this.emit("tick", this.currentTime);

    this.jumpToTime(newTime);

    return dt;

  }

  /**
   * Jump the simulation ahead to the specified time.
   * @param newTime the value to advance the simulation to. Negative values are
   *    not recommended as the tick events can't account for that.
   */
  jumpToTime(newTime: Date) {

    this.currentTime = newTime;

    //emit all time boundary events
    for (let c = 0; c < this.tickEvents.length; c++) {

      this.tickEvents[c].update(this.currentTime, this);

    }

  }
}
