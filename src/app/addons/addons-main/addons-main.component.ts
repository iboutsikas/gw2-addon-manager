import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, map, shareReplay } from 'rxjs';
import { AddonDescription } from '../store/state';

@Component({
  selector: 'app-addons-main',
  templateUrl: './addons-main.component.html',
  styleUrls: ['./addons-main.component.scss']
})
export class AddonsMainComponent implements OnInit {

  private addons: ReadonlyArray<AddonDescription> = [
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'ArcDPS',         installedVersion: "1.5",  latestVersion: "1.5",  installed: true,  needsUpdate: false, author: 'John Doe' },
    { name: 'Radial (DX11)',  installedVersion: "1.0",  latestVersion: "5.2",  installed: true,  needsUpdate: true,  author: null },
    { name: 'Radial (DX9)',   installedVersion: null,   latestVersion: "5.2",  installed: false, needsUpdate: false, author: null }
  ]
  private addOnsSubject: BehaviorSubject<ReadonlyArray<AddonDescription>>;

  public installed$: Observable<ReadonlyArray<AddonDescription>>;
  public available$: Observable<ReadonlyArray<AddonDescription>>;

  columnsToDisplay = ['name', 'actions', 'latestVersion', 'author'];

  constructor() {
    this.addOnsSubject = new BehaviorSubject(this.addons);

    let shared = this.addOnsSubject
    .pipe(shareReplay( { bufferSize: 1, refCount: true}));
    
    this.installed$ = shared
      .pipe(map(addons => addons.filter(addon => addon.installed)));

    this.available$ = shared
      .pipe(map(addons => addons.filter(addon => !addon.installed)));
  }

  ngOnInit(): void {
  }

}
