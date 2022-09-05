import { createAction, props } from '@ngrx/store';
import { Addon, HashMap, Loader, Manager } from '../addons.model';


export const installAddons = createAction(
    '[Addons] Add installed addons',
    props<{ addonsToInstall: HashMap<Addon> }>()
)

export const removeAddonsInstalled = createAction(
    '[Addons] Remove installed addons',
    props<{ updates: HashMap<Addon> }>()
)

export const updateAddonsStatus = createAction(
    '[Addons] Update addons status',
    props<{ updates: HashMap<Addon> }>()
)

export const updateAddonsStatusEnd = createAction(
    '[Addons] Update addons status end',
    props<{ updates: HashMap<Addon> }>()
)

export const fetchAddons = createAction(
    '[Addons] Fetch addons'
)

export const fetchAddonsSuccess = createAction (
    '[Addons] Fetch addons success',
    props<{ addons?: HashMap<Addon>, loader?: Loader, manager?: Manager }>()
)

export const fetchAddonsFailure = createAction (
    '[Addons] Fetch addons fail',
    props<any>()
)