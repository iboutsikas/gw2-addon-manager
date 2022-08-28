import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, map, shareReplay } from 'rxjs';
import { AddonService } from '../services/addon.service';
import { AddonDescription } from '../store/state';

@Component({
  selector: 'app-addons-main',
  templateUrl: './addons-main.component.html',
  styleUrls: ['./addons-main.component.scss']
})
export class AddonsMainComponent implements OnInit {

  private addons: ReadonlyArray<AddonDescription> = [
    { id: 1, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 2, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 3, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 4, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 5, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 6, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 7, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 8, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 9, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 10, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 11, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 69, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 13, name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { id: 14, name: 'Radial (DX11)',  installedVersion: "1.0",  latestVersion: "5.2",  installed: true,  needsUpdate: true,  author: null },
    { id: 15, name: 'Radial (DX9)',   installedVersion: null,   latestVersion: "5.2",  installed: false, needsUpdate: false, author: null }
  ]
  private addOnsSubject: BehaviorSubject<ReadonlyArray<AddonDescription>>;

  public installed$: Observable<ReadonlyArray<AddonDescription>>;
  public available$: Observable<ReadonlyArray<AddonDescription>>;

  columnsToDisplay = ['name', 'actions', 'latestVersion', 'author'];

  constructor(private addonService: AddonService) {
    this.addOnsSubject = new BehaviorSubject(this.addons);

    let shared = this.addOnsSubject
    .pipe(shareReplay( { bufferSize: 1, refCount: true}));
    
    this.installed$ = shared
      .pipe(map(addons => addons.filter(addon => addon.installed)));

    this.available$ = shared
      .pipe(map(addons => addons.filter(addon => !addon.installed)));
  }

  ngOnInit(): void {
    this.addonService.initializeInstallationFile();
  }

}
