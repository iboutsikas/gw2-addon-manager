import { Injectable, NgZone } from "@angular/core";
import { asyncScheduler, filter, map, observeOn, queueScheduler, switchMap, tap } from 'rxjs';
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as appActions from './actions';
import { AppConfig, AppState } from "./state";
import { ElectronService } from "../core/services";
import { TranslateService } from "@ngx-translate/core";
import { enterZone, leaveZone } from "app/shared/utils/zone.scheduler";
import { AddonService } from "app/addons/services/addon.service";
import { Router } from "@angular/router";

@Injectable()
export class ConfigEffects {

    appInitialize$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.appInitialize),
        observeOn(leaveZone(this.zone, asyncScheduler)),
        switchMap(_ => this.electronService.checkRequiresInitialization()),
        observeOn(enterZone(this.zone, queueScheduler)),
        tap(console.log),
        map(result => {
            const shouldInitialize = result.settings || result.magicFile || result.loader;

            if (shouldInitialize) {
                return appActions.appRequiresInitialization(result)
            }
            return appActions.appIsInitialized();
        })
    ));

    appRequiresInitialization$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.appRequiresInitialization),
        tap(_ => console.log('We want to initialize')),
        tap(action => this.router.navigateByUrl(`/initialize?settings=${action.settings}&magicFile=${action.magicFile}&loader=${action.loader}`))
    ), { dispatch: false });

    appIsInitialized$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.appIsInitialized),
        tap(_ => console.log('App is initialized')),
        tap(_ => this.router.navigate(['/addons']))
    ), { dispatch: false });


    writeConfig$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.storeConfig),
        concatLatestFrom(action => this.store.select(state => state.config)),
        map(combination => combination[1]),
        tap(config => this.electronService.saveConfig(config))
    ), { dispatch: false });

    updateLocale$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.changeLocale),
        map(action => action.newLocale),
        tap(locale => this.translateService.use(locale)),
        map(_ => appActions.storeConfig())
    ));

    updateLocale2$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.updateConfig),
        map(action => action.locale),
        filter(locale => locale.trim() != ''),
        tap(locale => this.translateService.use(locale))
    ), { dispatch: false });

    constructor(
        private electronService: ElectronService,
        private addonService: AddonService,
        private zone: NgZone,
        private actions$: Actions,
        private store: Store<AppState>,
        private translateService: TranslateService,
        private router: Router
    ) {
    }
}