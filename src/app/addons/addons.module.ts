import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddonsRoutingModule } from './addons-routing.module';
import { AddonsMainComponent } from './addons-main/addons-main.component';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [
    AddonsMainComponent
  ],
  imports: [ CommonModule, AddonsRoutingModule, CoreModule ]
})
export class AddonsModule { }
