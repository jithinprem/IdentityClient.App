import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./account/login/login.component";
import {RegisterComponent} from "./account/register/register.component";
import {NotFoundComponent} from "./shared/components/errors/not-found/not-found.component";
import {PlayComponent} from "./play/play.component";
import {authorizationGuard} from "./shared/guards/authorization.guard";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authorizationGuard],
    children: [
      {
        path: 'play', component: PlayComponent,
      }
    ]
  },
  // implementing lazy loading (when ever navigating to account module we do )
  {path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'}, // any path that's not assigned
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
