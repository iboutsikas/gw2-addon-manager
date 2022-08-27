import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddonsRoutingModule } from './addons-routing.module';
import { AddonsMainComponent } from './addons-main/addons-main.component';
import { CoreModule } from '../core/core.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    AddonsMainComponent
  ],
  imports: [ 
    CommonModule, 
    AddonsRoutingModule, 
    CoreModule, 
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class AddonsModule { }
