import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SummonerService {
  constructor(private http: HttpClient) { }

  getSummoner(name: string) {
    return this.http.get(`http://localhost:8080/api/summoner/${name}`);
  }

  getSummmoners() {
    return this.http.get(`http://localhost:8080/api/summoners/`);
  }

  getActiveGame(id: string) {
    return this.http.get(`http://localhost:8080/api/activeGame/${id}`);
  }

  getSpectateFile(gameId: string, observerKey: string) {
    return this.http.get(`http://localhost:8080/api/spectate/${gameId}/${observerKey}`, { responseType: 'blob' as 'json' });
  }
}
