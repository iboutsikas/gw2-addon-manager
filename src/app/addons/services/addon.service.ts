import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { map, tap, switchMap, forkJoin, Subscription, filter, share, Observable, Subject, timer } from 'rxjs';
import { ElectronService } from '../../core/services';
import { AppState } from '../../store/state';
import { Store } from '@ngrx/store';
import * as addonActions from '../store/actions';

import { APP_CONFIG } from '../../../environments/environment'
import { Addon, InstallationInfo, Loader } from '@gw2-am/common';
import { IPCMessages } from '../../../../app/dist/out-tsc/common/ipcMessages';

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
  private installAddonsSubject: Subject<any> = new Subject();
  private instanceSubject: Subject<any> = new Subject();
  constructor(
    private es: ElectronService,
    private store: Store<AppState>
  ) {
  }

  public fetchAllAddons(): void {
    this.store.dispatch(addonActions.fetchAddons());
  }

  public installAddons(addons: Addon[], loaderDownloadData: Loader): Observable<any> {
    this.es.ipcRenderer.invoke(IPCMessages.INSTALL_ADDONS, addons, loaderDownloadData).then(result => {

    });


    return this.installAddonsSubject.asObservable();
  }

  public updateAddonsStatus(changes): Observable<any> {
    this.es.ipcRenderer.invoke('update-addon-status', changes).then(result => {
      // this.statusUpdatesSubject.next(result);
    });

    return this.statusUpdatesSubject.asObservable();
  }

  initializeGameInstance(gamepath: string): Observable<InstallationInfo> {
    this.es.ipcRenderer.invoke(IPCMessages.INITIALIZE_INSTANCE, gamepath).then(
      result => this.instanceSubject.next(result),
      err => this.instanceSubject.error(err)
    );

    return this.instanceSubject.asObservable();
  }
}
