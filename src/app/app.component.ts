import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/state';
import { appInitialize } from './store/actions'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(store: Store<AppState>) {
    store.dispatch(appInitialize())
  }
}
