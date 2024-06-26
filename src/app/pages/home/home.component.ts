import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchTerm: string = '';

  constructor(private router: Router) { }

  onSearch() {
    if (this.searchTerm.trim() === '') { return; }
    this.router.navigate(['summoner', this.searchTerm]);
  }

  onSummoners() {
    this.router.navigate(['leaderboard']);
  }
}
