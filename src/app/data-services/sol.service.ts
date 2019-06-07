import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolService {

  solDataUrl = "assets/sol.json";

  constructor(private http: HttpClient) { }

  getSol(): Observable<any> {

    //use a local copy if possible, because that's a lotta bandwidth.
    let rawSol = window.localStorage.getItem("Sol");

    if (rawSol) {
      let localSol = JSON.parse(rawSol);

      return of(localSol);
    }
    else {
      //intercept the response and shove it into local storage for later.
      let request = this.http.get(this.solDataUrl);
      request.subscribe(solData => window.localStorage.setItem("Sol", JSON.stringify(solData)));
      return request;
    }
    
  }
}
