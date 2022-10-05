import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ElectronService } from '../core/services';
import { FilePathValidator } from '../shared/validators/filepath.validator';
import { AppConfig, AppState } from '../store/state';
import * as configActions from '../store/actions'
import { selectGamepath } from 'app/store/selectors';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  gamepath$: Observable<string>;
  gamepath: string = null;

  constructor(
    private store: Store<AppState>
  ) 
  {
    this.gamepath$ = store.select(selectGamepath);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onSaveSettings(): void {
  }

  onPathChanged(event): void {
    this.store.dispatch(configActions.updateConfig({ gamepath: event }));
  }
}
