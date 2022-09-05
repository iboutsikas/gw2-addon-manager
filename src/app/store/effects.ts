import { Injectable } from "@angular/core";
import { filter, map, tap } from 'rxjs';
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as configActions from './actions';
import { AppConfig, AppState } from "./state";
import { ElectronService } from "../core/services";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class ConfigEffects {

    writeConfig$ = createEffect(() => this.actions$.pipe(
        ofType(configActions.storeConfig),
        concatLatestFrom(action => this.store.select(state => state.config)),
        map(combination => combination[1]),
        tap(config => this.electronService.saveConfig(config))
    ), { dispatch: false });

    updateLocale$ = createEffect(() => this.actions$.pipe(
        ofType(configActions.changeLocale),
        map(action => action.newLocale),
        tap(locale => this.translateService.use(locale)),
        map(_ => configActions.storeConfig())
    ));

    updateLocale2$ = createEffect(() => this.actions$.pipe(
        ofType(configActions.updateConfig),
        map(action => action.locale),
        filter(locale => locale.trim() != ''),
        tap(locale => this.translateService.use(locale))
    ), { dispatch: false});

    constructor(
        private electronService: ElectronService,
        private actions$: Actions,
        private store: Store<AppState>,
        private translateService: TranslateService
    ) {
    }
}