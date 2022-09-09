import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { map, tap, switchMap, forkJoin, Subscription, filter, share, Observable, Subject, timer } from 'rxjs';
import { ElectronService } from '../../core/services';
import { AppState } from '../../store/state';
import { Store } from '@ngrx/store';
import * as addonActions from '../store/actions';

import { APP_CONFIG } from '../../../environments/environment'
import { Addon, InstallationInfo } from '@gw2-am/common';

// interface InstallationInformation {
//   version: number;
//   installedAddons: AddonFromJSON[];
// }

// export interface StatusUpdateReply {
//   succeeded: AddonDescription[];
//   failed: AddonDescription[];
// };

@Injectable({
  providedIn: 'root'
})
export class AddonService {
  private statusUpdatesSubject: Subject<any> = new Subject();
  private installationFileSubject: Subject<InstallationInfo> = new Subject();
  private installAddonsSubject: Subject<any> = new Subject();

  constructor(
    private es: ElectronService,
    private store: Store<AppState>
  ) 
  {
  }

  public fetchAllAddons(): void {
    this.store.dispatch(addonActions.fetchAddons());
  }

  public installAddons(addons: Addon[]): Observable<any> {
    this.es.ipcRenderer.invoke('install-addons', addons).then(result => {

    });


    return this.installAddonsSubject.asObservable();
  }

  public updateAddonsStatus(changes): Observable<any> {
    this.es.ipcRenderer.invoke('update-addon-status', changes).then(result => {
      // this.statusUpdatesSubject.next(result);
    });

    return this.statusUpdatesSubject.asObservable();
  }

  public initializeInstallation(path: string): Observable<InstallationInfo> {
    this.es.ipcRenderer.invoke('initialize-installation', path).then(result => {
      this.installationFileSubject.next(result);
    });

    return this.installationFileSubject.asObservable();
  }
}
