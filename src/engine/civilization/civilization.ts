import { Vessel } from '../physics';
import { Colony } from './colony';

export class Civlization {

  //basic data
  id:number;
  name:string;
  shortName:string;

  //colonies
  colonies:Colony[];

  //ships
  ships:Vessel[];

  //known data

  //technology


  constructor(id:number, name:string, shortName:string) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.colonies = new Array<Colony>();
    this.ships = new Array<Vessel>();
  }
}