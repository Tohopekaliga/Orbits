import { TickEvent } from './tick-event';
import { EventEmitter } from 'protractor';

describe('TickEvent', () => {

  let now = new Date();
  let te = new TickEvent(1, "test", now);

  it('should create an instance', () => {
    expect(te).toBeTruthy();
  });

});
