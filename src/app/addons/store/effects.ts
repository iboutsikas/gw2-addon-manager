import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map, tap, catchError, bufferTime, filter, observeOn, asyncScheduler, queueScheduler, OperatorFunction, Observable, buffer, debounceTime, shareReplay } from 'rxjs';

import { AppState } from "../../store/state";
import * as addonActions from './actions'
import * as appActions from '../../store/actions';
// import { selectAllAddons } from './selectors';

import { APP_CONFIG } from '../../../environments/environment'
import { AddonService } from "../services/addon.service";
import { enterZone, leaveZone } from "../../shared/utils/zone.scheduler";
import { Addon, AddonManagerConfig, APIResponse, HashMap, InstallationInfo } from "@gw2-am/common";
import { selectGamepath } from "app/store/selectors";
import { AppEffects } from "app/store/effects";
import { selectLoaderDownloadData } from "./selectors";


type BufferDebounce = <T>(debounce: number) => OperatorFunction<T, T[]>;

const bufferDebounce: BufferDebounce = debounce => source =>
    new Observable(observer =>
        source.pipe(buffer(source.pipe(debounceTime(debounce)))).subscribe({
            next(x) {
                observer.next(x);
            },
            error(err) {
                observer.error(err);
            },
            complete() {
                observer.complete();
            },
        })
    );

@Injectable()
export class AddonEffects {
    initializeInstance$ = createEffect(() => this.store.select(selectGamepath).pipe(
        filter(gamepath => gamepath.trim() != ''),
        observeOn(leaveZone(this.zone, asyncScheduler)),
        switchMap(gamepath => this.addonService.initializeGameInstance(gamepath)),
        observeOn(enterZone(this.zone, queueScheduler)),
        map(info => addonActions.updateInstallationInfo({ info }))
    ));

    fetchAddonsOnInit$ = createEffect(() => this.actions$.pipe(
        ofType(appActions.appInitialize),
        map(_ => addonActions.fetchAddons())
    ));

    // Typescript is losing it's mind over the types here, so we tell it to pipe down
    // @ts-ignore
    fetchAddons$ = createEffect(() => this.actions$.pipe(
        ofType(addonActions.fetchAddons),
        switchMap(_ => this.http.get<APIResponse>('https://gw2-addon-loader.github.io/addon-repo/addons.json').pipe(
            map((res: APIResponse) => addonActions.fetchAddonsSuccess({ addons: res.addons, loaderDownloadData: res.loader })),
            catchError(err => addonActions.fetchAddonsFailure(err))
        ))
    ));

    installAddons$ = this.actions$.pipe(
        ofType(addonActions.installAddons),
        map(action => action.addonsToInstall),
        bufferDebounce(2 * 1000),
        filter(installations => installations.length !== 0),
        map((installations: HashMap<Addon>[]) => {
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
        concatLatestFrom(_ => this.store.select(selectLoaderDownloadData)),
        observeOn(leaveZone(this.zone, asyncScheduler)),
        switchMap(([addons, loader]) => this.addonService.installAddons(addons, loader)),
        observeOn(enterZone(this.zone, queueScheduler)),
        shareReplay()
    );
    
    installAddonsSuccess$ = createEffect(() => this.installAddons$.pipe(
        map((value: any) => value.successes),
        map(installedAddons => addonActions.installAddonsSuccess({ addons: installedAddons}))
    ))

    installAddonsFail$ = createEffect(() => this.installAddons$.pipe(
        map((value: any) => value.failures),
        map(keys => addonActions.installAddonsFail({ addonKeys: keys}))
    ))

    uninstallAddons$ = this.actions$.pipe(
        ofType(addonActions.uninstallAddons),
        map(action => action.addonsToUninstall),
        bufferDebounce(2 * 1000),
        filter(installations => installations.length !== 0),
        map((installations: HashMap<Addon>[]) => {
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
        observeOn(leaveZone(this.zone, asyncScheduler)),
        switchMap((addons) => this.addonService.uninstallAddons(addons)),
        observeOn(enterZone(this.zone, queueScheduler)),
        shareReplay()
    )

    uninstallAddonsSuccess$ = createEffect(() => this.uninstallAddons$.pipe(
        map((keys: string[]) => addonActions.uninstallAddonsSuccess({ addonKeys: keys }))
    ));

    updateAddons$ = this.actions$.pipe(
        ofType(addonActions.updateAddon),
        map(action => action.addon),
        bufferDebounce(2 * 1000),
        filter(updates => updates.length != 0),
        map(updates => {
            const result = [];
            const hash = {};

            for (let addon of updates) {

                if (hash.hasOwnProperty(addon.nickname))
                    continue;

                hash[addon.nickname] = 1;
                result.push(addon);
            }
            return result;
        }),
        observeOn(leaveZone(this.zone, asyncScheduler)),
        switchMap((addons) => this.addonService.updateAddons(addons)),
        observeOn(enterZone(this.zone, queueScheduler)),
        shareReplay()
    )

    updateAddonsSuccess$ = createEffect(() => this.updateAddons$.pipe(
        map((value: any) => value.successes),
        map(updatedAddons => addonActions.updateAddonsSuccess({ addons: updatedAddons}))
    ));

    updateAddonsFail$ = createEffect(() => this.updateAddons$.pipe(
        map((value: any) => value.failures),
        map(keys => addonActions.updateAddonsFail({ addonKeys: keys}))
    ));


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