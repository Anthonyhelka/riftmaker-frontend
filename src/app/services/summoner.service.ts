import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SummonerService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getSummoner(name: string) {
    return this.http.get(`${this.baseUrl}/api/summoner/${name}`);
  }

  getSummmoners() {
    return this.http.get(`${this.baseUrl}/api/summoners/`);
  }

  getActiveGame(id: string) {
    return this.http.get(`${this.baseUrl}/api/activeGame/${id}`);
  }

  getSpectateFile(gameId: string, observerKey: string) {
    return this.http.get(`${this.baseUrl}/api/spectate/${gameId}/${observerKey}`, { responseType: 'blob' as 'json' });
  }
}
