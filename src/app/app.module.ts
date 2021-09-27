import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { SummonerComponent } from './pages/summoner/summoner.component';
import { WhoopsComponent } from './pages/whoops/whoops.component';
import { HttpClientModule } from '@angular/common/http';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { FormsModule } from '@angular/forms';
import { MatchTimerComponent } from './components/match-timer/match-timer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    SummonerComponent,
    WhoopsComponent,
    LeaderboardComponent,
    MatchTimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
