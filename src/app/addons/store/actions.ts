import { createAction, props } from '@ngrx/store';
import { AddonDescription, AddonFromJSON, AddonHashMap } from './state';


export const updateAddonsInstalled = createAction(
    '[Addons] Update installed addons',
    props<{ updates: AddonHashMap }>()
)

export const markAddonsEnabled = createAction(
    '[Addons] Mark addons enabled',
    props<{ updates: AddonHashMap }>()
)

export const markAddonsDisabled = createAction(
    '[Addons] Mark addons disabled',
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