import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  constructor(
    private http: HttpClient
  ) { }

  public getPlayers() {
    return this.http.get(`${environment.appUrl}/api/play/get-players`);
  }
}
