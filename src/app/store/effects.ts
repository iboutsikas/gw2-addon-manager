import { Injectable, NgZone } from "@angular/core";
import { asyncScheduler, bufferTime, debounceTime, filter, map, observeOn, queueScheduler, shareReplay, switchMap, tap } from 'rxjs';
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as appActions from './actions';

import { AppConfig, AppState } from "./state";
import { ElectronService } from "../core/services";
import { TranslateService } from "@ngx-translate/core";
import { enterZone, leaveZone } from "app/shared/utils/zone.scheduler";
import { AddonService } from "app/addons/services/addon.service";
import { Router } from "@angular/router";
import { AddonManagerConfig } from "../../../common/shared-interfaces";
import { InstallationInfo } from "../../../common/addons/addon-interfaces";
import { create } from "domain";
import { selectAppConfig, selectLocale } from "./selectors";

@Injectable()
export class ConfigEffects {

    appInitialize$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.appInitialize),
        observeOn(leaveZone(this.zone, asyncScheduler)),
        switchMap(_ => this.electronService.initializeAppBackend()),
        observeOn(enterZone(this.zone, queueScheduler)),
        shareReplay()
    ), { dispatch: false});

    appHasGamepath$ = createEffect(() => this.appInitialize$.pipe(
        filter((result: {config: AddonManagerConfig, installationInfo: InstallationInfo | null}) => result.config.gamepath != '')
    ), { dispatch: false});

    navigateToAddonsAfterInit$ = createEffect(() => this.appHasGamepath$.pipe(
        tap(_ => this.router.navigateByUrl("/addons")),
    ), { dispatch: false});

    updateAppconfigFromInitialize$ = createEffect(() => this.appInitialize$.pipe(
        map((value : {config: AddonManagerConfig, installationInfo: InstallationInfo | null} ) => value.config),
        map(config => appActions.updateConfig(config))
    ));
    
    appDoesNotHaveConfig$ = createEffect(() => this.appInitialize$.pipe(
        filter((result: {config: AddonManagerConfig, installationInfo: InstallationInfo | null}) => result.config.gamepath == ''),
        map(_ => this.router.navigateByUrl("/settings"))
    ), {dispatch: false});

    appHasInstallationInfo$ = createEffect(() => this.appInitialize$.pipe(
        filter((result: {config: AddonManagerConfig, installationInfo: InstallationInfo | null}) => result.installationInfo != null),
        map(value => value.installationInfo)        
    ), {dispatch: false});

    writeConfig$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.storeConfig),
        concatLatestFrom(action => this.store.select(state => state.config)),
        map(combination => combination[1]),
        tap(config => this.electronService.saveConfig(config))
    ), { dispatch: false });

    writeConfigFromUpdate$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.updateConfig),
        debounceTime(1 * 1000),
        concatLatestFrom(_ => this.store.select(selectAppConfig)),
        // Array [0] is the action, array [1] is the state (with the 1sec delay)
        map(array => array[1]),
        tap(state => this.electronService.saveConfig(state))
    ), {dispatch: false})

    updateLocaleFromAction$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.changeLocale),
        map(action => action.newLocale),
        map(locale => appActions.updateConfig({ locale: locale}))
    ));

    updateLocaleFromState$ = createEffect(() => this.store.select(selectLocale).pipe(
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