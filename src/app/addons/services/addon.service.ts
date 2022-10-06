import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ElectronService } from '../../core/services';
import { AppState } from '../../store/state';
import { Store } from '@ngrx/store';
import * as addonActions from '../store/actions';

import { Addon, InstallationInfo, IPCMessages, Loader } from '@gw2-am/common';


@Injectable({
  providedIn: 'root'
})
export class AddonService {

  private statusUpdatesSubject: Subject<any> = new Subject();
  private installAddonsSubject: Subject<any> = new Subject();
  private uninstallAddonsSubject: Subject<any> = new Subject();
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
      this.installAddonsSubject.next(result);
    });


    return this.installAddonsSubject.asObservable();
  }

  public uninstallAddons(addons: Addon[]): Observable<any> {
    this.es.ipcRenderer.invoke(IPCMessages.UNINSTALL_ADDONS, addons).then(result => {
      this.uninstallAddonsSubject.next(result);
    });
    
    return this.uninstallAddonsSubject.asObservable();
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
