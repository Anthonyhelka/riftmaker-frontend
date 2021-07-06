import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SummonerService } from 'src/app/services/summoner.service';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.sass']
})
export class SummonerComponent {
  name: string = '';

  constructor(private activatedRoute: ActivatedRoute, private summonerService: SummonerService) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.name = params.path;
      this.getSummoner();
    });
  }

  getSummoner() {
    this.summonerService.getSummoner(this.name).subscribe((resBody: any) => {
      debugger
    })
  }
}
