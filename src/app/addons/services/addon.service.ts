import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { map, tap, switchMap, forkJoin, Subscription, filter, share, Observable, Subject, timer } from 'rxjs';
import { load as yamlLoad } from 'js-yaml';
import { ElectronService } from '../../core/services';
import { AppState } from '../../store/state';
import { Store } from '@ngrx/store';
import * as addonActions from '../store/actions';
import { AddonDescription, AddonFromJSON } from '../store/state';

import { APP_CONFIG } from '../../../environments/environment'

interface InstallationInformation {
  version: number;
  installedAddons: AddonFromJSON[];
  disabledAddons: AddonFromJSON[];
}

@Injectable({
  providedIn: 'root'
})
export class AddonService {

  private gamePath: string;
  private statusUpdatesSubject: Subject<any> = new Subject();

  constructor(
    private http: HttpClient,
    private es: ElectronService,
    private store: Store<AppState>
  ) {
    this.store.select(state => state.config.gamePath)
      .pipe(
        filter(path => path && path.trim() !== ''),
        map(path => this.initializeInstallation(path))
      )
      .subscribe();
  }

  public fetchAllAddons() : void {
    this.store.dispatch(addonActions.fetchAddons());
  }

  public updateAddonsStatus(changes: AddonDescription[]): Observable<any> {

    setTimeout(() => {
      this.statusUpdatesSubject.next('Marika')
    }, 1000);


    



    return this.statusUpdatesSubject.asObservable();
  }

  /**
   * Will create the gwaddonmanager file as well as
   * the addons and disabled-addons folders if they are missing
   * @param path the installation path of GW2
   */
  private initializeInstallation(path: string): InstallationInformation {
    const installationFilePath = this.es.path.join(path, 'gw2addonmanager');
    let info: InstallationInformation = {
      version: 1,
      installedAddons: [],
      disabledAddons: []
    };

    try {
      const text = this.es.fs.readFileSync(installationFilePath, 'utf8');
      info = JSON.parse(text);
    }
    catch (e) {
      if (e.code !== 'ENOENT')
        throw e;

      // Make the file first
      let json = JSON.stringify(info, null, 2);
      this.es.fs.writeFileSync(installationFilePath, json);

      // Since this might be a completely new installation,
      // let's also make a couple of directories we will need
      const addonsDirectory = this.es.path.join(this.gamePath, 'addons');
      const disabledAddonsDirectory = this.es.path.join(this.gamePath, 'disabled-addons');

      if (!this.es.fs.existsSync(addonsDirectory)) {
        this.es.fs.mkdirSync(addonsDirectory);
      }

      if (!this.es.fs.existsSync(disabledAddonsDirectory)) {
        this.es.fs.mkdirSync(disabledAddonsDirectory);
      }
    }
    finally {
      return info;
    }
  }

  public refreshAddons(): void {
    return;

  }
}
