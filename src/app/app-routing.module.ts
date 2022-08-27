import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddonsRoutingModule } from './addons/addons-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    AddonsRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
