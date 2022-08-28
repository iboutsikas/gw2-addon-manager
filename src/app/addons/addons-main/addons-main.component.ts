import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, map, shareReplay } from 'rxjs';

import { AddonService } from '../services/addon.service';
import { AddonDescription } from '../store/state';
import { selectAvailableAddons, selectInstalledAddons } from '../store/selectors';
import { AppState } from '../../store/state';

@Component({
  selector: 'app-addons-main',
  templateUrl: './addons-main.component.html',
  styleUrls: ['./addons-main.component.scss']
})
export class AddonsMainComponent implements OnInit {


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

}
