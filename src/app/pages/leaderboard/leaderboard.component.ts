import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummonerService } from 'src/app/services/summoner.service';
import { webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  summoners: any[] = [];
  filteredSummoners: any[] = [];

  // Filters
  activeGameFilter: boolean = true;

  // Loading
  updating: boolean = false;
  lastUpdated: Date = new Date();
  dataLoaded: boolean = false;
  loading: boolean = false;
  loadTime: number = 0;

  wsUrl = environment.wsUrl;

  constructor(private summonerService: SummonerService, private router: Router) { }

  ngOnInit(): void {
    this.connectWebSocket();
    this.getSummoners();
  }

  connectWebSocket(): void {
    let subject = webSocket(`${this.wsUrl}`);
    subject.subscribe((message: any) => this.onMessage(message), (error: any) => this.onError(error), () => console.log('complete'));
  }

  onMessage(message: any): void {
    if (message.status === 'startUpdate') {
      this.updating = true;
    }
    if (message.status === 'summonerUpdate') {
      if (this.dataLoaded) {
        const summonerIndex = this.summoners.findIndex((item: any) => item.summonerId === message.data.summonerId);
        if (this.summoners[summonerIndex].activeGame.status && !message.data.activeGame.status) {
          console.log(`NO LONGER IN GAME: ${this.summoners[summonerIndex].summonerName}`);
        }
        this.summoners[summonerIndex] = message.data;
        if (this.summoners[summonerIndex].activeGame.status) {
          console.log(`CURRENTLY IN GAME: ${this.summoners[summonerIndex].summonerName}`);
          const participant = this.summoners[summonerIndex].activeGame.data.participants.find((item: any) => item.summonerId === this.summoners[summonerIndex].summonerId);
          this.summoners[summonerIndex]['champion'] = `https://cdn.communitydragon.org/11.19.1/champion/${participant.championId}/square`;
          this.summoners[summonerIndex]['gameId'] = this.summoners[summonerIndex].activeGame.data.gameId;
          this.summoners[summonerIndex]['observerKey'] = this.summoners[summonerIndex].activeGame.data.observers.encryptionKey;
        }
        this.sortSummoners();
        this.onFilter();
      }
    }
    if (message.status === 'finishUpdate') {
      this.updating = false;
    }
  }

  onError(error: any): void {
    console.log(error)
  }

  getSummoners(): void {
    this.loading = true;
    const startTime = new Date().getTime();
    this.summonerService.getSummmoners().subscribe((resBody: any) => {
      this.dataLoaded = true;
      this.loading = false;
      this.loadTime = (new Date().getTime() - startTime) / 1000;
      this.summoners = resBody;
      for (let summoner of this.summoners) {
        if (summoner.activeGame.status) {
          const participant = summoner.activeGame.data.participants.find((item: any) => item.summonerId === summoner.summonerId);
          summoner['champion'] = `https://cdn.communitydragon.org/11.19.1/champion/${participant.championId}/square`;
          summoner['gameId'] = summoner.activeGame.data.gameId;
          summoner['observerKey'] = summoner.activeGame.data.observers.encryptionKey;
        }
      }
      this.sortSummoners();
      this.onFilter();
    }, (error: any) => {
      this.dataLoaded = true;
      this.loading = false;
      this.loadTime = (new Date().getTime() - startTime) / 1000;
      console.log(error);
    });
  }

  getSummoner(summoner: any): void {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/summoner/${summoner.summonerName}`]));
    window.open(url, '_blank');
  }

  getSpectateFile(event: any, summoner: any): void {
    event.stopPropagation();
    this.loading = true;
    const observerKey = summoner.observerKey.replace(/\//g, 'ForwardSlash');
    this.summonerService.getSpectateFile(summoner.gameId, observerKey).subscribe((resBody: any) => {
      this.loading = false;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(resBody);
      a.download = `riftmaker-spectate-${summoner.gameId}.bat`;
      a.click();
    });
  }

  onChangeActiveGameFilter() {
    this.activeGameFilter = !this.activeGameFilter;
    this.onFilter();
  }

  onFilter() {
    this.filteredSummoners = this.summoners;
    if (this.activeGameFilter) {
      this.filteredSummoners = this.summoners.filter((summoner: any) => summoner.activeGame.status);
    }
  }

  sortSummoners() {
    this.summoners.sort((a, b) => b.leaguePoints - a.leaguePoints);
    for (let i = 0; i < this.summoners.length; i++) {
      this.summoners[i]['position'] = i + 1;
    }
  }
}
