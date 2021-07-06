import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SummonerService {
  constructor(private http: HttpClient) { }

  getSummoner(name: string) {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // const options = { headers };
    return this.http.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=RGAPI-288aaf42-5222-4b58-b3b8-f8464ae075ec`);
  }
}
