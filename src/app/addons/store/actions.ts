import { Addon,HashMap,InstallationInfo,InstalledAddonMetadata,Loader, Manager } from '@gw2-am/common';
import { createAction, props } from '@ngrx/store';
import { AddonState } from './state';


export const installAddons = createAction(
    '[Addons] Install addons',
    props<{ addonsToInstall: HashMap<Addon> }>()
)

export const installAddonsSuccess = createAction(
    '[Addons] Install addons success',
    props<{ addons: InstalledAddonMetadata[] }>()
)

export const installAddonsFail = createAction(
    '[Addons] Install addons Fail',
    props<{ addonKeys: string[] }>()
)

export const updateAddon = createAction(
    '[Addons] Update addon',
    props<{ addon: Addon }>()
);

export const updateAddonsSuccess = createAction(
    '[Addons] Update addons success',
    props<{ addons: InstalledAddonMetadata[] }>()
)

export const updateAddonsFail = createAction(
    '[Addons] Update addons Fail',
    props<{ addonKeys: string[] }>()
)

export const uninstallAddons = createAction(
    '[Addons] Uninstall addons',
    props<{ addonsToUninstall: HashMap<Addon> }>()
)

export const uninstallAddonsSuccess = createAction(
    '[Addons] Uninstall addons success',
    props<{ addonKeys: string[] }>()
)

export const fetchAddons = createAction(
    '[Addons] Fetch addons'
)

export const fetchAddonsSuccess = createAction (
    '[Addons] Fetch addons success',
    props<AddonState>()
)

export const fetchAddonsFailure = createAction (
    '[Addons] Fetch addons fail',
    props<any>()
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

export const updateInstallationInfo = createAction (
    '[Addons] Update installation info',
    props<{ info: InstallationInfo }>()
)

