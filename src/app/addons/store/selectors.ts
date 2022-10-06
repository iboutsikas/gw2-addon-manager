import { createSelector } from "@ngrx/store";
import { tap } from "rxjs";
import { AppState } from "../../store/state";
import * as semver from 'semver';
import { Addon, HashMap, InstallationInfo, InstalledAddonMetadata } from "@gw2-am/*";

export const selectAddonsFeature = (state: AppState) => state.addons;

export const selectLoaderMetadata = createSelector(
    selectAddonsFeature,
    (feature) => feature.loaderMetadata
)

export const selectLoaderDownloadData = createSelector(
    selectAddonsFeature,
    (feature) => feature.loaderDownloadData
)

export const selectAllAddons = createSelector(
    selectAddonsFeature,
    (feature) => feature.addons
);

export const selectInstalledInfo = createSelector(
    selectAddonsFeature,
    (feature) => feature.installed
)

export const selectInstalledAddons = createSelector(
    selectAllAddons,
    selectInstalledInfo,
    (addons: HashMap<Addon>, info: HashMap<InstalledAddonMetadata>) => {
        const result = [];

        Object.keys(info).forEach(key => {
            const addon = { ...addons[key] };

            if (!addon.version_id_is_human_readable) {
                addon.needs_update = addon.version_id != info[key].version;
            }
            else {
                const cleanA = semver.clean(addon.version_id);
                const cleanB = semver.clean(info[key].version);
                addon.needs_update = semver.gt(cleanA, cleanB);
            }
            addon.installed_version = info[key].version;
            addon.status = info[key].status;
            result.push(addon);
        });
        return result;
    }
)

export const selectAvailableAddons = createSelector(
    selectAllAddons,
    selectInstalledInfo,
    (addons, info) => {
        let result = [];
        Object.keys(addons).forEach(key => {
            if (!(key in info))
                result.push(addons[key]);
        });
        return result
    }
)