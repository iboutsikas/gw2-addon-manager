import { createSelector } from "@ngrx/store";
import { tap } from "rxjs";
import { AppState } from "../../store/state";

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
    (addons, info) => {
        return Object.keys(info).map(key => addons[key]);
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