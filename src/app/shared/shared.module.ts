import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';


import { EmailValidator, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GamepathInputComponent } from './components/gamepath-input/gamepath-input.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    GamepathInputComponent
  ],
  imports: [
    CommonModule, 
    TranslateModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatIconModule, 
    MatInputModule, 
    MatButtonModule,
    MatFormFieldModule
  ],
  exports: [TranslateModule, FormsModule, ReactiveFormsModule, EmailValidator, GamepathInputComponent]
})
export class SharedModule { }
