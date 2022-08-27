import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ElectronService } from '../core/services';
import { FilePathValidator } from '../shared/validators/filepath.validator';
import { AppConfig, AppState } from '../store/state';
import * as configActions from '../store/actions'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription;

  settingsForm: FormGroup;

  constructor(
    private store: Store<AppState>,
    private electronService: ElectronService,
    private filepathValidator: FilePathValidator,
    private fb: FormBuilder
  ) 
  {
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      gamePath: ['', this.filepathValidator.validate.bind(this.filepathValidator)]
    })

    this.subscriptions.add(
      this.store.select(state => state.config.gamePath)
        .subscribe(path => {
          this.settingsForm.patchValue({
            gamePath: path
          });
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSaveSettings(): void {
    const filepath = this.settingsForm.controls['gamePath'].value;
    console.log(filepath);
    this.store.dispatch(configActions.updateConfig({ gamePath: filepath}));
    this.store.dispatch(configActions.storeConfig({}))
  }
}
