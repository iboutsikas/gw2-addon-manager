import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddonsRoutingModule } from './addons-routing.module';
import { AddonsMainComponent } from './addons-main/addons-main.component';
import { CoreModule } from '../core/core.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { addonsReducer } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { AddonEffects } from './store/effects';
import { SharedModule } from 'app/shared/shared.module';
import { AddonsTableComponent } from './addons-table/addons-table.component';


@NgModule({
  declarations: [
    AddonsMainComponent,
    AddonsTableComponent
  ],
  imports: [ 
    CommonModule,
    HttpClientModule,
    AddonsRoutingModule, 
    SharedModule,
    CoreModule, 
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBarModule,
    StoreModule.forFeature('addons', addonsReducer),
    EffectsModule.forFeature([AddonEffects])
  ]
})
export class AddonsModule { }
