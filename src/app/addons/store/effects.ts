import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map, tap, catchError, bufferTime, filter, observeOn, asyncScheduler, queueScheduler } from 'rxjs';

import { AppState } from "../../store/state";
import * as addonActions from './actions'
import * as appActions from '../../store/actions';
// import { selectAllAddons } from './selectors';

import { APP_CONFIG } from '../../../environments/environment'
import { AddonService } from "../services/addon.service";
import { enterZone, leaveZone } from "../../shared/utils/zone.scheduler";
import { Addon, AddonManagerConfig, APIResponse, InstallationInfo } from "@gw2-am/common";
import { selectGamepath } from "app/store/selectors";
import { AppEffects } from "app/store/effects";


@Injectable()
export class AddonEffects {



    // installationFile$ = createEffect(() => 
    //     this.store.select(state => state.config.gamePath).pipe(
    //         filter(path => path && path.trim() !== ''),
    //         observeOn(leaveZone(this.zone, asyncScheduler)),
    //         switchMap(path => this.addonService.initializeInstallation(path)),
    //         observeOn(enterZone(this.zone, queueScheduler)),
    //         map(info => info.addons),
    //         map(addons => {
    //             let hash = {}
    //             for (let addon of addons) {
    //                 hash[addon.id] = addon;
    //             }
    //             return hash;
    //         }),
    //         map(addons => addonActions.addAddonsInstalled({ updates: addons }))
    //     ));
    
    // setupInstallation$ = createEffect(() => this.store.select(state => state.config.gamePath).pipe(
    //     filter(path => path && path.trim() !== ''),
    //     observeOn(leaveZone(this.zone, asyncScheduler)),
    //     switchMap(path => this.addonService.initializeInstallation(path)),
    //     observeOn(enterZone(this.zone, queueScheduler))
    // ), { dispatch: false });

    initializeInstance$ = createEffect(() => this.store.select(selectGamepath).pipe(
        filter(gamepath => gamepath.trim() != ''),
        observeOn(leaveZone(this.zone, asyncScheduler)),
        switchMap(gamepath => this.addonService.initializeGameInstance(gamepath)),
        observeOn(enterZone(this.zone, queueScheduler)),
        map(info => addonActions.updateInstallationInfo({ info }))
    ));

    // appHasInstallationInfo$ = createEffect(() => this.appEffects.appInitialize$.pipe(
    //     filter((result: {config: AddonManagerConfig, installationInfo: InstallationInfo | null}) => result.installationInfo != null),
    //     map(value => value.installationInfo),
    //     map(info => addonActions.updateInstallationInfo({ info }))  
    // ));
    

    fetchAddonsOnInit$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.appInitialize),
        map(_ => addonActions.fetchAddons())
    ));

    // Typescript is losing it's mind over the types here, so we tell it to pipe down
    // @ts-ignore
    fetchAddons$ = createEffect(() => this.actions$.pipe(
        ofType(addonActions.fetchAddons),
        switchMap(_ => this.http.get<APIResponse>('assets/test-data.json').pipe(
            map((res: APIResponse) => addonActions.fetchAddonsSuccess({addons: res.addons, loader: res.loader })),
            catchError(err => addonActions.fetchAddonsFailure(err))
        ))
    ));

    installAddons$ = createEffect(() => this.actions$.pipe(
        ofType(addonActions.installAddons),
        map(action => action.addonsToInstall),
        bufferTime(1 * 1000),
        filter(installations => installations.length !== 0),
        map((installations: Map<string, Addon>[]) => {
            // Here we want to combine all of the hash maps
            // into a single hash map. This will remove all duplicates
            let result = {};
            for (let installation of installations) {
                Object.keys(installation).forEach(key => {
                    result[key] = installation[key];
                })
            }
            return result;
        }),
        // Now map them into an array of objects
        map(installations => Object.keys(installations).map(key => installations[key])),
        switchMap(addons => this.addonService.installAddons(addons)),
        tap(console.log)
    ), { dispatch: false });

    // @ts-ignore
    // updateStatus$ = createEffect(() => this.actions$.pipe(
    //     ofType(addonActions.updateAddonsStatus),
    //     map(action => action.updates),
    //     bufferTime(1 * 1000),
    //     filter(changes => changes.length !== 0),
    //     map((changes: AddonHashMap[]) => {
    //         // The array of changes might have the same item multiple times. So we will ignore
    //         // all but the first encounter
    //         const consolidatedChanges = {};

    //         for (let change of changes) {
    //             Object.keys(change).forEach(key => {
    //                 if (!(key in consolidatedChanges))
    //                     consolidatedChanges[key] = change[key];
    //             })
    //         }
    //         return consolidatedChanges;
    //     }),
    //     concatLatestFrom(_ => this.store.select(selectAllAddons)),
    //     map((array) =>  {
    //         // We need to create a flat array of AddonDescriptions 
    //         // with the status flag we want them to have. This will be passed on to 
    //         // node so that can do the file operations

    //         let changedAddons = [];
    //         const changes = array[0];
    //         const addons = array[1];

    //         for (let addon of addons) {
    //             if (!(addon.id in changes))
    //                 continue;

    //             let copy = { ...addon };
    //             copy.status = changes[addon.id].status;
    //             changedAddons.push(copy);
    //         }

           
    //         return changedAddons;
    //     }),
    //     observeOn(leaveZone(this.zone, asyncScheduler)),
    //     switchMap(changes => this.addonService.updateAddonsStatus(changes)),
    //     observeOn(enterZone(this.zone, queueScheduler)),
    //     map((changes: AddonHashMap) => {
    //         let result = {};
    //         Object.keys(changes).forEach(key => {
    //             result[key] = { status: changes[key] }
    //         })
    //         return result;
    //     }),
    //     map(updates => addonActions.updateAddonsStatusEnd({ updates }))
    // ));

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private addonService: AddonService,
        private zone: NgZone,
        private store: Store<AppState>,
        private appEffects: AppEffects
    ) { }
}