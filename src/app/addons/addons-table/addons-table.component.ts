import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';


import { Store } from '@ngrx/store';
import { AppState } from 'app/store/state';
import { Addon, HashMap } from '../../../../common/addons/addon-interfaces';

import * as addonActions from '../store/actions'

@Component({
  selector: 'app-addons-table',
  templateUrl: './addons-table.component.html',
  styleUrls: ['./addons-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddonsTableComponent implements OnInit {

  @Input()
  public addons: Addon[];

  @Input()
  public containsInstalledAddons: boolean = true;

  public columnsToDisplay = ['name', 'actions', 'latestVersion', 'author'];

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  onInstallClicked(addon: Addon): void {
    const payload: HashMap<Addon> = {}
    payload[addon.nickname] = addon;
    
    this.store.dispatch(addonActions.installAddons({ addonsToInstall: payload }));
  }

  onUninstallClicked(addon: Addon): void {
    const payload: HashMap<Addon> = {}
    payload[addon.nickname] = addon;
    
    this.store.dispatch(addonActions.uninstallAddons({ addonsToUninstall: payload }));
  }

  onDisableClicked(addon: Addon): void {
    // const thing: AddonHashMap = { };
    // thing[addon.id] = { id: addon.id, name: addon.name, version:addon.latestVersion, status: AddonStatus.DISABLED }
    
    // this.store.dispatch(addonActions.updateAddonsStatus({ updates: thing } ))
  }

  onEnableClicked(addon: Addon): void {
    // const thing: AddonHashMap = { };
    // thing[addon.id] = { id: addon.id, name: addon.name, version:addon.latestVersion, status: AddonStatus.ENABLED }
    
    // this.store.dispatch(addonActions.updateAddonsStatus({ updates: thing } ))
  }

}
