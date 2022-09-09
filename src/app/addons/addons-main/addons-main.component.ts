import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';

import { AddonService } from '../services/addon.service';
import { selectAvailableAddons, selectInstalledAddons } from '../store/selectors';
import { AppState } from '../../store/state';
import * as addonActions from '../store/actions';
import { Addon } from '@gw2-am/common';

@Component({
  selector: 'app-addons-main',
  templateUrl: './addons-main.component.html',
  styleUrls: ['./addons-main.component.scss']
})
export class AddonsMainComponent implements OnInit {

  // public readonly addonStatus: typeof AddonStatus = AddonStatus;

  public installed$: Observable<any>;
  public available$: Observable<any>;

  columnsToDisplay = ['name', 'actions', 'latestVersion', 'author'];

  constructor(
    private addonService: AddonService,
    private store: Store<AppState>
    
  ) {
    this.installed$ = this.store.select(selectInstalledAddons)
    // .pipe(tap(addons => console.log('Installed addons as seen from the main component', addons)));
    
    this.available$ = this.store.select(selectAvailableAddons)
    // .pipe(tap(addons => console.log('Available addons as seen from the main component', addons)));
  }

  ngOnInit(): void {
    this.addonService.fetchAllAddons();
  }

  onInstallClicked(addon: Addon): void {

    const payload: Map<string, Addon> = new Map<string, Addon>();

    payload[addon.nickname] = addon;
    this.store.dispatch(addonActions.installAddons({ addonsToInstall: payload }));
  }

  onUninstallClicked(addon: Addon): void {
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
