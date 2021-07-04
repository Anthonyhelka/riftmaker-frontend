import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SummonerComponent } from './pages/summoner/summoner.component';
import { WhoopsComponent } from './pages/whoops/whoops.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'summoner', component: HomeComponent },
  { path: 'summoner/:path', component: SummonerComponent },
  { path: 'whoops' , component: WhoopsComponent },
  { path: '**', redirectTo: '/whoops' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
