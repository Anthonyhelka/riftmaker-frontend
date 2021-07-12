import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  path = 'home';

  constructor(private location: Location) { }

  ngOnInit(): void {
    const path = this.location.path();
    console.log(path)
    if (path === '/' || path.includes('home')) {
      this.path = 'home';
    } else if (path.includes('leaderboard')) {
      this.path = 'leaderboard';
    } else if (path.includes('profile')) {
      this.path = 'profile';
    } else {
      this.path = 'home';
    }
  }

  onNavigate(desiredPath: string): void {
    this.path = desiredPath;
  }
}
