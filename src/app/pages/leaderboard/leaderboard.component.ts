import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummonerService } from 'src/app/services/summoner.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  summoners: any[] = [];
  summonerLimit: number = 75;

  loading: boolean = false;
  loadTime: number = 0;

  constructor(private summonerService: SummonerService, private router: Router) { }

  ngOnInit(): void {
    this.getSummoners();
  }

  getSummoners(): void {
    this.loading = true;
    const startTime = new Date().getTime();
    this.summonerService.getSummmoners().subscribe((resBody: any) => {
      this.loading = false;
      this.summoners = [];
      for (let i = 0; i < this.summonerLimit; i++) {
        resBody[i]['activeGame'] = 0;
        this.summoners.push(resBody[i]);
      }
      console.log(this.summoners)
      for (let i = 0; i < this.summonerLimit; i++) {
        this.getActiveGame(this.summoners[i]);
      }
    }, (error: any) => {
      this.loading = false;
      this.loadTime = (new Date().getTime() - startTime) / 1000;
      console.log(error);
    });
  }

  getActiveGame(summoner: any): void {
    this.loading = true;
    const startTime = new Date().getTime();
    this.summonerService.getActiveGame(summoner.summonerId).subscribe((resBody: any) => {
      this.loading = false;
      this.loadTime = (new Date().getTime() - startTime) / 1000;
      summoner['activeGame'] = resBody.activeGame ? 2 : 1;
      if (resBody.activeGame) {
        const participant = resBody.data.participants.find((participant: any) => participant.summonerId === summoner.summonerId);
        summoner['champion'] = `https://cdn.communitydragon.org/11.12.1/champion/${participant.championId}/square`;
        summoner['gameId'] = resBody.data.gameId;
        summoner['observerKey'] = resBody.data.observers.encryptionKey;
      }
      if (summoner.summonerName === 'Draven696969') {
        this.loadTime = (new Date().getTime() - startTime) / 1000;
      }
    }, (error: any) => {
      this.loading = false;
      this.loadTime = (new Date().getTime() - startTime) / 1000;
      console.log(error);
    });
  }

  getSummoner(summoner: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/summoner/${summoner.summonerName}`]));
    window.open(url, '_blank');
  }

  getSpectateFile(summoner: any) {
    this.loading = true;
    this.summonerService.getSpectateFile(summoner.gameId, summoner.observerKey).subscribe((resBody: any) => {
      this.loading = false;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(resBody);
      a.download = `riftmaker-spectate-${summoner.gameId}.bat`;
      a.click();
    });
  }
}
