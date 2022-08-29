import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { map, tap, switchMap, forkJoin, Subscription, filter, share, Observable, Subject, timer } from 'rxjs';
import { ElectronService } from '../../core/services';
import { AppState } from '../../store/state';
import { Store } from '@ngrx/store';
import * as addonActions from '../store/actions';
import { AddonDescription, AddonFromJSON, AddonStatus } from '../store/state';

import { APP_CONFIG } from '../../../environments/environment'

interface InstallationInformation {
  version: number;
  installedAddons: AddonFromJSON[];
}

export interface StatusUpdateReply {
  succeeded: AddonDescription[];
  failed: AddonDescription[];
};

@Injectable({
  providedIn: 'root'
})
export class AddonService {
  private statusUpdatesSubject: Subject<StatusUpdateReply> = new Subject();
  private installationSubject: Subject<any> = new Subject();

  constructor(
    private es: ElectronService,
    private store: Store<AppState>
  ) 
  {
  }

  public fetchAllAddons(): void {
    this.store.dispatch(addonActions.fetchAddons());
  }

  public updateAddonsStatus(changes: AddonDescription[]): Observable<StatusUpdateReply> {
    this.es.ipcRenderer.invoke('update-addon-status', changes).then(result => {
      this.statusUpdatesSubject.next(result);
    });

    return this.statusUpdatesSubject.asObservable();
  }

  public initializeInstallation(path: string): Observable<any> {
    this.es.ipcRenderer.invoke('initialize-installation', path).then(result => {
      this.installationSubject.next(result);
    });

    return this.installationSubject.asObservable();
  }
}
