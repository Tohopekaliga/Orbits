import { SimTime } from './time';
import { Galaxy } from './space/galaxy';

/**
 * Core class for game logic, client or server.
 */
export class GameCore {

  ///////
  //Subsystems

  //SimTime
  //Keep the absolute sim date, handle time compression, and emitting time boundary events
  time: SimTime = new SimTime();

  //Galaxy
  //Keep physical star system data for updates.
  space: Galaxy = new Galaxy();

  //Civilization
    //Maintain data on sapient lifeforms, their civilizations, political entities, and artificial objects associated with them.
    //Necessarily rather interdepentent with the Galaxy system

  //Players
    //The players should just be tied to a specific civilization/political entity, but need control over it.

  //UI
    //Linkage to Angular. Shouldn't run at all in a server-side


}
