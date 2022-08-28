import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, switchMap, forkJoin, Subscription, filter, share } from 'rxjs';
import { load as yamlLoad } from 'js-yaml';
import { ElectronService } from '../../core/services';
import { AppState } from '../../store/state';
import { Store } from '@ngrx/store';
import * as addonActions from '../store/actions';
import { AddonFromJSON } from '../store/state';

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

  constructor(
    private http: HttpClient,
    private es: ElectronService,
    private store: Store<AppState>
  ) {
    // let installationInfo$ = this.store.select(state => state.config.gamePath)
    //   .pipe(
    //     filter(path => path && path.trim() !== ''),
    //     map(path => this.initializeInstallation(path)),
    //     share()
    //   );

    // installationInfo$.pipe(
    //   map(info => info.installedAddons),
    //   filter(addons => addons.length != 0)
    // ).subscribe(installedAddons => {
    //   this.store.dispatch(addonActions.updateAddonsInstalled(installedAddons))
    // });

    // installationInfo$.pipe(
    //   map(info => info.disabledAddons),
    //   filter(addons => addons.length != 0)
    // ).subscribe(disabledAddons => {
    //   this.store.dispatch(addonActions.updateAddonsDisabled(disabledAddons))
    // });
  }

  public fetchAllAddons() : void {
    this.store.dispatch(addonActions.fetchAddons());
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

    /**
     * Quick description of how we are getting the data:
     * 
     * We start from https://api.github.com/repos/gw2-addon-loader/Approved-Addons/contents/ and this will give us everything in the
     * repo. This is 1 web request 
     * 
     * We loop over all the contents and take the directories only.
     * 
     * From the directories we extract the names.
     * 
     * For each name we make 1 request to get the info of the addon's update-placeholder.yaml. This is 1 request per name.
     * 
     * From the info we extract the download_url
     * 
     * For each name we download the yaml, this is again 1 request per name.
     * 
     * So in total this update will require 1 + 2N request, where N is the number of addons available.
     */

    // this.http.get<any>('https://api.github.com/repos/gw2-addon-loader/Approved-Addons/contents/')
    //   .pipe(
    //     tap(console.log),
    //     map(list => list.filter(e => e.type == 'dir')),
    //     map(list => list.map(e => e.name)),
    //     map(names => names.map(name => `https://api.github.com/repos/gw2-addon-loader/Approved-Addons/contents/${name}/update-placeholder.yaml`)),
    //     switchMap(links => {
    //       const httpRequests = links.map(link =>
    //         this.http.get(link).pipe(
    //           map(json => json['download_url'])
    //         )
    //       );
    //       return forkJoin(httpRequests);
    //     }),
    //     switchMap((links: any) => {
    //       const httpRequests = links.map(link =>
    //         this.http.get(link, { observe: 'body', responseType: 'text' }).pipe(
    //           map(yamltxt => yamlLoad(yamltxt))
    //         )
    //       );
    //       return forkJoin(httpRequests);
    //     })
    //   )
    // .subscribe(thing => {
    //   console.log(thing);
    // })
  }
}
