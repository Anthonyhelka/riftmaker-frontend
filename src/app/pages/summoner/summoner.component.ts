import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SummonerService } from 'src/app/services/summoner.service';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss']
})
export class SummonerComponent {
  name: string = '';
  wins: number = 0;
  losses: number = 0;
  rank: any = { tier: '', division: '', leaguePoints: ''}

  loading: boolean = false;
  loadTime: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private summonerService: SummonerService) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.name = params.path;
      this.getSummoner();
    });
  }

  getSummoner() {
    this.loading = true;
    const startTime = new Date().getTime();
    this.summonerService.getSummoner(this.name).subscribe((resBody: any) => {
      this.loading = false;
      this.loadTime = (new Date().getTime() - startTime) / 1000;
      console.log(resBody);

      this.name = resBody.summonerName;
      this.wins = resBody.wins;
      this.losses = resBody.losses;
      this.rank = {
        tier: resBody.tier,
        division: resBody.rank,
        leaguePoints: resBody.leaguePoints
      };
    }, (error: any) => {
      this.loading = false;
      this.loadTime = (new Date().getTime() - startTime) / 1000;
      console.log(error);
    });
  }
}
