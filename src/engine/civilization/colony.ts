import { Orbiter } from '../physics';

export class Colony {
  id:number;
  name:string;

  //a colony could also be a space colony, thus on a vessel
  body:Orbiter;

  population:number;
  maxPopulation:number;

  get annualGrowthRate():number { return this._annualGrowthRate }
  set annualGrowthRate(r:number) {
    this._annualGrowthRate = r;
    this.growthPerSec = r / (365 * 24 * 60 * 60);
  }

  private growthPerSec:number;
  private _annualGrowthRate:number;

  private fractionalPerson:number = 0;

  constructor(id:number, name:string, body:Orbiter, maxPop:number, pop:number) {
    this.id = id;
    this.name = name;
    this.body = body;
    this.population = pop;
    this.maxPopulation = maxPop;

    this.annualGrowthRate = 0.01;
  }

  update(dt:number) { //dt is in seconds

    this.population += this.computePopGrowth(dt);

  }

  computePopGrowth(dt:number) {
    let growth = dt * this.growthPerSec * this.population;
    let intGrowth = Math.floor(growth)

    if(this.growthPerSec > 0) {

      this.fractionalPerson += growth - intGrowth;

      if(this.fractionalPerson > 1) {
        this.fractionalPerson -= 1;
        intGrowth += 1;
      }
    }
    else {
      let absGrowth = Math.abs(growth);
      this.fractionalPerson -= absGrowth - Math.floor(absGrowth);

      if(this.fractionalPerson < -1) {
        this.fractionalPerson += 1;
        intGrowth -= 1;
      }
    }

    return intGrowth;
  }
}