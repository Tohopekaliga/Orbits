import { Injectable } from '@angular/core';
import { SolService } from './sol.service';
import { Observable, of } from 'rxjs';
import { StarSystem } from 'src/engine/star-system';
import { SystemGenerator } from 'src/engine/system-generator';
import { Vessel } from 'src/engine/physics';
import { Convert } from 'src/engine/math3d';

@Injectable({
  providedIn: 'root'
})
export class LoadGameService {

  constructor(
    private solService: SolService) { }

  newGame(): Observable<StarSystem> {

    var systemData = new Observable<StarSystem>((observer) => {

      this.solService.getSol().subscribe((solData) => {
        let solSystem = SystemGenerator.loadFromJson(solData);
        var vessel = new Vessel(
          "Orbital 1",
          0.01671123,
          Convert.AUtoKM(1.00000261) * 1000,
          102.93768193,
          -0.1513, 0, 0, solSystem.star, 0, 0);
        solSystem.addShip(vessel);

        observer.next(solSystem);
        observer.complete();

      });

      return { unsubscribe() { } };
    });

    return systemData;
  }
}
