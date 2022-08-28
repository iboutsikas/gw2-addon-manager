import { createSelector } from "@ngrx/store";
import { AppState } from "../../store/state";
import { AddonDescription, AddonFromJSON, AddonHashMap, AddonState } from "./state";

export const selectAddons = (state: AppState) => state.addons;

export const selectInstalledAddonInfo = createSelector(
    selectAddons,
    (state: AddonState) => state.installedAddons
);

export const selectDisabledAddonInfo = createSelector(
    selectAddons,
    (state: AddonState) => state.disabledAddons
);

export const selectAllAddons = createSelector(
    selectAddons,
    (state: AddonState) => state.addons
)

export const selectInstalledAddons = createSelector(
    selectInstalledAddonInfo,
    selectAllAddons,
    (info: AddonHashMap, addons: AddonDescription[]) => {
        let result = []
        addons.forEach(addon => {
            if (addon.id in info) {
                const copy:AddonDescription = { ...addon };
                copy.installed = true;
                copy.installedVersion = info[addon.id].version
                copy.needsUpdate = copy.latestVersion > copy.installedVersion;
                result.push(copy);
            }
        })
        return result;
    }
)

export const selectDisabledAddons = createSelector(
    selectDisabledAddonInfo,
    selectAllAddons,
    (info: AddonHashMap, addons: AddonDescription[]) => {
        return addons.filter(a => !(a.id in info));
    }
)