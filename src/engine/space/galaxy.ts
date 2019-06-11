import { StarSystem } from './star-system';

/**
 * The Galaxy is where the stars are.
 */
export class Galaxy {

  systems: StarSystem[] = [];

  /**
   * Update the physical state of the galaxy
   * @param dt delta time since last update. Negative values will
   *      cause everything to go backwards, but not fail
   */
  update(dt) {
    for (let c = 0; c < this.systems.length; c++) {
      this.systems[c].update(dt);
    }
  }

}
