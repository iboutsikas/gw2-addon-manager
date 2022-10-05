import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, shareReplay, tap } from 'rxjs';

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
  public haveAddonsInstalled$: Observable<boolean>;

  public selectedIndex: number = 0;
  

  constructor(
    private addonService: AddonService,
    private store: Store<AppState>
    
  ) {
    this.installed$ = this.store.select(selectInstalledAddons)
    .pipe(shareReplay())
    // .pipe(tap(addons => console.log('Installed addons as seen from the main component', addons)));
    
    this.haveAddonsInstalled$ = this.installed$.pipe(
      map(addons => addons && addons.length != 0)
    );

    this.available$ = this.store.select(selectAvailableAddons)
    //.pipe(tap(addons => console.log('Available addons as seen from the main component', addons)));
  }

  ngOnInit(): void {
    this.addonService.fetchAllAddons();
  }
}
