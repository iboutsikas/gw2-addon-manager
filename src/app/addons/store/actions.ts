import { createAction, props } from '@ngrx/store';
import { AddonDescription, AddonFromJSON, AddonHashMap } from './state';


export const addAddonsInstalled = createAction(
    '[Addons] Add installed addons',
    props<{ updates: AddonHashMap }>()
)

export const removeAddonsInstalled = createAction(
    '[Addons] Remove installed addons',
    props<{ updates: AddonHashMap }>()
)

export const updateAddonsStatus = createAction(
    '[Addons] Update addons status',
    props<{ updates: AddonHashMap }>()
)

export const updateAddonsStatusEnd = createAction(
    '[Addons] Update addons status end',
    props<{ updates: AddonHashMap }>()
)

export const fetchAddons = createAction(
    '[Addons] Fetch addons'
)

export const fetchAddonsSuccess = createAction (
    '[Addons] Fetch addons success',
    props<{ addons: AddonDescription[] }>()
)

export const fetchAddonsFailure = createAction (
    '[Addons] Fetch addons fail',
    props<any>()
)