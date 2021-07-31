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
  summonerLimit: number = 75;

  // Filters
  activeGameFilter: boolean = false;

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
    console.log(message);
    if (message.status === 'updating') {
      this.updating = true;
    }
    if (message.status === 'updated') {
      this.updating = false;
      this.lastUpdated = new Date(message.timestamp);
      this.getSummoners();
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
      for (let i = 0; i < this.summoners.length; i++) {
        this.summoners[i]['position'] = i + 1;
        if (this.summoners[i].activeGame.status) {
          const participant = this.summoners[i].activeGame.data.participants.find((item: any) => item.summonerId === this.summoners[i].summonerId);
          this.summoners[i]['champion'] = `https://cdn.communitydragon.org/11.12.1/champion/${participant.championId}/square`;
          this.summoners[i]['gameId'] = this.summoners[i].activeGame.data.gameId;
          this.summoners[i]['observerKey'] = this.summoners[i].activeGame.data.observers.encryptionKey;
        }
      }
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
}
