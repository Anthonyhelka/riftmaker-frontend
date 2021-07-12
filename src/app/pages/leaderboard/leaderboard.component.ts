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
  summonerLimit: number = 75;

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
      for (const summoner of this.summoners) {
        if (summoner.activeGame.status) {
          const participant = summoner.activeGame.data.participants.find((item: any) => item.summonerId === summoner.summonerId);
          summoner['champion'] = `https://cdn.communitydragon.org/11.12.1/champion/${participant.championId}/square`;
          summoner['gameId'] = summoner.activeGame.data.gameId;
          summoner['observerKey'] = summoner.activeGame.data.observers.encryptionKey;
        }
      }
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
}
