import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map, tap, catchError, bufferTime, filter, observeOn, asyncScheduler, queueScheduler } from 'rxjs';

import { AppState } from "../../store/state";
import * as addonActions from './actions'
import { selectAllAddons } from './selectors';

import { APP_CONFIG } from '../../../environments/environment'
import { AddonDescription, AddonHashMap } from "./state";
import { AddonService } from "../services/addon.service";
import { enterZone, leaveZone } from "../../shared/utils/zone.scheduler";

@Injectable()
export class AddonEffects {

    // Typescript is losing it's mind over the types here, so we tell it to pipe down
    // @ts-ignore
    fetchAddons$ = createEffect(() => this.actions$.pipe(
        ofType(addonActions.fetchAddons),
        switchMap(_ => this.http.get(`${APP_CONFIG.apiBase}/api/addons`).pipe(
            map((addons: AddonDescription[]) => addonActions.fetchAddonsSuccess({ addons })),
            catchError(err => addonActions.fetchAddonsFailure(err))
        ))
    ));

    updateStatus$ = createEffect(() => this.actions$.pipe(
        ofType(addonActions.updateAddonsStatus),
        map(action => action.updates),
        bufferTime(5 * 1000),
        filter(changes => changes.length !== 0),
        map((changes: AddonHashMap[]) => {
            // The array of changes might have the same item multiple times. So we will ignore
            // all but the first encounter
            const consolidatedChanges = {};

            for (let change of changes) {
                console.log(change);
                Object.keys(change).forEach(key => {
                    if (!(key in consolidatedChanges))
                        consolidatedChanges[key] = change[key];
                })
            }
            return consolidatedChanges;
        }),
        concatLatestFrom(_ => this.store.select(selectAllAddons)),
        map((array) =>  {
            // We need to create a flat array of AddonDescriptions 
            // with the status flag we want them to have. This will be passed on to 
            // node so that can do the file operations

            let changedAddons = [];
            const changes = array[0];
            const addons = array[1];

            for (let addon of addons) {
                if (!(addon.id in changes))
                    continue;

                let copy = { ...addon };
                copy.status = changes[addon.id].status;
                changedAddons.push(copy);
            }

           
            return changedAddons;
        }),
        observeOn(leaveZone(this.zone, asyncScheduler)),
        switchMap(changes => this.addonService.updateAddonsStatus(changes)),
        observeOn(enterZone(this.zone, queueScheduler)),
        tap((thing) => {

            console.log(thing);
            console.log(`Are we in NgZone: ${NgZone.isInAngularZone()}`);
        })
    ), { dispatch: false });

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private addonService: AddonService,
        private zone: NgZone,
        private store: Store<AppState>
    ) { }
}