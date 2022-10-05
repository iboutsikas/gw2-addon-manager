import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from '../../../store/state';
import * as appActions from '../../../store/actions';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { IPCMessages } from '../../../../../common/ipcMessages';
import { InitializationRequirements } from '../../../../../common/shared-interfaces';
// import * as storage from 'electron-json-storage';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private initializeSubject$: Subject<any> = new Subject();

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  // jsonStorage: typeof storage;

  constructor(private store: Store<AppConfig>) {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.fs = window.require('fs');
      this.path = window.require('path');
      
      this.childProcess = window.require('child_process');
    
      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  requestClose(): void {
    if (!this.isElectron)
      return;
    this.ipcRenderer.send(IPCMessages.CLOSE_APPLICATION);
  }

  requestMinimize(): void {
    if (!this.isElectron)
      return;
    this.ipcRenderer.send(IPCMessages.MINIMIZE_APPLICATION);
  }

  loadConfig() : void {
    if (!this.isElectron)
      return;

    this.ipcRenderer.invoke('load-config').then((config) => {
      this.store.dispatch(appActions.updateConfig(config));
    })
  }

  saveConfig(config): void {
    if (!this.isElectron)
      return;

    this.ipcRenderer.invoke('save-config', config).then(success => {
      console.log('Settings saved!');
    },
    err => {
      console.error('Failed to save settings', err);
    })
  }

  openGamepathDialog(path: string | null = null): Promise<string> {
    path = path || '';
    const result = new Promise<string>((resolve, reject) => {
      this.ipcRenderer.invoke(IPCMessages.OPEN_FILE_DIALOG, path).then(
        result => resolve(result),
        err => reject(err)
      )
    });
    return result;
  }

  initializeAppBackend(): Observable<any> {
    this.ipcRenderer.invoke(IPCMessages.INITIALIZE_APPLICATION).then(
      result => this.initializeSubject$.next(result),
      err => this.initializeSubject$.error(err)
    )

    return this.initializeSubject$.asObservable();
  }
}
