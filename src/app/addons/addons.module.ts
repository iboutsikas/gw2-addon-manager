import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddonsRoutingModule } from './addons-routing.module';
import { AddonsMainComponent } from './addons-main/addons-main.component';
import { CoreModule } from '../core/core.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { addonsReducer } from './store/reducers';



@NgModule({
  declarations: [
    AddonsMainComponent
  ],
  imports: [ 
    CommonModule,
    HttpClientModule,
    AddonsRoutingModule, 
    CoreModule, 
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    StoreModule.forFeature('addons', addonsReducer)
  ]
})
export class AddonsModule { }
