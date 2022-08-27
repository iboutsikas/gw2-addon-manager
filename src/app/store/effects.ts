import { Injectable } from "@angular/core";
import { map, tap } from 'rxjs';
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as configActions from './actions';
import { AppConfig, AppState } from "./state";
import { ElectronService } from "../core/services";

@Injectable()
export class ConfigEffects {

    writeConfig$ = createEffect(() => this.actions$.pipe(
        ofType(configActions.storeConfig),
        concatLatestFrom(action => this.store.select(state => state.config)),
        map(combination => combination[1]),
        tap(config => this.electronService.saveConfig(config))
    ), { dispatch: false});

    constructor(
        private electronService: ElectronService,
        private actions$: Actions,
        private store: Store<AppState>
    ) {        
    }
}