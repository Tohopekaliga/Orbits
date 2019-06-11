import { EventEmitter } from 'events';

/**
 * Class to handle tracking of time for specific tick events,
 * daily, weekly, etc
 */
export class TickEvent {

  time: number;
  event: string;
  last: Date;

  constructor(time: number, event: string, last: Date) {
    this.time = time;
    this.event = event;
    this.last = last;
  }

  /**
   * Perform an update to current time. If newTime passes the threshold,
   * will emit the time event and update Last
   * @param {Date} newTime new Sim Time to check
   * @param {EventEmitter} emitter the object handling actual events.
   *    Most likely SimTime
   */
  update(newTime: Date, emitter: EventEmitter) {

    let diff = newTime.getTime() - this.last.getTime();

    if (diff > this.time) {

      //if it was a big timestep, emit for every pass
      let total = Math.floor(diff / this.time);

      for (let t = 0; t < total; t++) {
        //this number shouldn't be drifting based on vagaries of dt
        this.last = new Date(this.last.getTime() + this.time)

        emitter.emit(this.event, this.last);
      }

    }
  }


}
