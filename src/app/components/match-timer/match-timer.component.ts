import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-timer',
  templateUrl: './match-timer.component.html',
  styleUrls: ['./match-timer.component.scss']
})
export class MatchTimerComponent implements OnInit {
  @Input() summoner: any;
  gameLength: number = 0;
  gameLengthFormat: string = '00:00';
  gameLengthInterval: any;

  ngOnInit(): void {
    if (this.summoner.activeGame.status) {
      this.gameLength = this.summoner.activeGame.data.gameLength;
      this.gameLengthInterval = setInterval(() => {
        this.gameLength++;
        this.gameLengthFormat = this.formatGameLength(this.gameLength);
      }, 1000);
    } else {
      clearInterval(this.gameLengthInterval);
    }
  }

  formatGameLength(gameLength: number) {
    if (gameLength > 0) {
      let minutes: any = Math.floor(gameLength / 60);
      let seconds: any = gameLength - minutes * 60;
      if (minutes >= 0 && minutes < 10) { minutes = `0${minutes}`}
      if (seconds >= 0 && seconds < 10) { seconds = `0${seconds}`}
      return `${minutes}:${seconds}`;
    } else {
      return '00:00';
    }
  }
}
