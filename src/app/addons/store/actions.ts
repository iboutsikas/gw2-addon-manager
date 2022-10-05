import { Addon,InstallationInfo,Loader, Manager } from '@gw2-am/common';
import { createAction, props } from '@ngrx/store';


export const installAddons = createAction(
    '[Addons] Add installed addons',
    props<{ addonsToInstall: Map<string, Addon> }>()
)

export const removeAddonsInstalled = createAction(
    '[Addons] Remove installed addons',
    props<{ updates: Map<string, Addon> }>()
)

export const updateAddonsStatus = createAction(
    '[Addons] Update addons status',
    props<{ updates: Map<string, Addon> }>()
)

export const updateAddonsStatusEnd = createAction(
    '[Addons] Update addons status end',
    props<{ updates: Map<string, Addon> }>()
)

export const updateInstallationInfo = createAction (
    '[Addons] Update installation info',
    props<{ info: InstallationInfo }>()
)

export const fetchAddons = createAction(
    '[Addons] Fetch addons'
)

export const fetchAddonsSuccess = createAction (
    '[Addons] Fetch addons success',
    props<{ addons?: Map<string, Addon>, loader?: Loader, manager?: Manager }>()
)

export const fetchAddonsFailure = createAction (
    '[Addons] Fetch addons fail',
    props<any>()
)