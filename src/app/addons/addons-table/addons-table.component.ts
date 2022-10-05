import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Addon } from '@gw2-am/common';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/state';

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
    const payload: Map<string, Addon> = new Map<string, Addon>();
    payload.set(addon.nickname, addon);
    
    this.store.dispatch(addonActions.installAddons({ addonsToInstall: payload }));
  }

  onUninstallClicked(addon: Addon): void {
    console.log(addon)
    // const thing: AddonHashMap = { };
    // thing[addon.id] = { id: addon.id, name: addon.name, version:addon.latestVersion, status: addon.status }
    
    // this.store.dispatch(addonActions.removeAddonsInstalled({ updates: thing } ))
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
