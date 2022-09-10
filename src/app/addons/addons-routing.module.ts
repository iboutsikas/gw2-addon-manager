import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddonsMainComponent } from './addons-main/addons-main.component';
import { AddonManagerInitializerComponent } from './addon-manager-initializer/addon-manager-initializer.component';

const routes: Routes = [
  {
    path: 'addons',
    component: AddonsMainComponent,
    pathMatch: 'full'
  },
  {
    path: 'initialize',
    component: AddonManagerInitializerComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddonsRoutingModule {}
