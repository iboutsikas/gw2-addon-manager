import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of, switchMap, map, tap, catchError } from 'rxjs';

import { AppState } from "../../store/state";
import * as addonActions from './actions'

import { APP_CONFIG } from '../../../environments/environment'
import { AddonDescription } from "./state";

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

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<AppState>
    ) { }
}