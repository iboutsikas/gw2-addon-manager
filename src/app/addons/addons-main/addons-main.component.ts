import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AddonService } from '../services/addon.service';
import { AddonDescription, AddonHashMap, AddonStatus } from '../store/state';
import { selectAvailableAddons, selectInstalledAddons } from '../store/selectors';
import { AppState } from '../../store/state';
import * as addonActions from '../store/actions';

@Component({
  selector: 'app-addons-main',
  templateUrl: './addons-main.component.html',
  styleUrls: ['./addons-main.component.scss']
})
export class AddonsMainComponent implements OnInit {

  public readonly addonStatus: typeof AddonStatus = AddonStatus;

  public installed$: Observable<ReadonlyArray<AddonDescription>>;
  public available$: Observable<ReadonlyArray<AddonDescription>>;

  columnsToDisplay = ['name', 'actions', 'latestVersion', 'author'];

  constructor(
    private addonService: AddonService,
    private store: Store<AppState>
    
  ) {
    this.installed$ = this.store.select(selectInstalledAddons);
    this.available$ = this.store.select(selectAvailableAddons);
  }

  ngOnInit(): void {
    this.addonService.fetchAllAddons();
  }

  onInstallClicked(addon: AddonDescription): void {
    const thing: AddonHashMap = { };
    thing[addon.id] = { id: addon.id, name: addon.name, version:addon.latestVersion, status: AddonStatus.ENABLED }
    
    this.store.dispatch(addonActions.addAddonsInstalled({ updates: thing } ))
  }

  onUninstallClicked(addon: AddonDescription): void {
    const thing: AddonHashMap = { };
    thing[addon.id] = { id: addon.id, name: addon.name, version:addon.latestVersion, status: addon.status }
    
    this.store.dispatch(addonActions.removeAddonsInstalled({ updates: thing } ))
  }

  onDisableClicked(addon: AddonDescription): void {
    const thing: AddonHashMap = { };
    thing[addon.id] = { id: addon.id, name: addon.name, version:addon.latestVersion, status: AddonStatus.DISABLED }
    
    this.store.dispatch(addonActions.markAddonsDisabled({ updates: thing } ))
  }

  onEnableClicked(addon: AddonDescription): void {
    const thing: AddonHashMap = { };
    thing[addon.id] = { id: addon.id, name: addon.name, version:addon.latestVersion, status: AddonStatus.ENABLED }
    
    this.store.dispatch(addonActions.markAddonsEnabled({ updates: thing } ))
  }
}
