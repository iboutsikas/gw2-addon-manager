import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddonsMainComponent } from './addons-main/addons-main.component';

const routes: Routes = [
  {
    path: 'addons',
    component: AddonsMainComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddonsRoutingModule {}
