import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as actions from './actions';
import { AddonState } from './state';

import { Addon, InstalledAddonMetadata } from '@gw2-am/common';

const initialState: AddonState = {
    addons: {},
    installed: {}
};

// const mapToIdAsKey = (props: ReadonlyArray<AddonFromJSON>): any => {
//     let result: any = {};

//     Object.keys(props).forEach(key => {
//         const addon = props[key];
//         result[addon.id] = addon;
//     });

//     return result;
// }

export const addonsReducer = createReducer(
    initialState,
    // on(actions.addAddonsInstalled, (state, { updates }) => {
    //     const addons = { ...state.installedAddons, ...updates };
    //     return { ...state, installedAddons: addons };
    // }),
    // on(actions.removeAddonsInstalled, (state, { updates }) => {
    //     const addons = { ...state.installedAddons };

    //     Object.keys(updates).forEach(key => {
    //         delete (addons[key]);
    //     });

    //     return { ...state, installedAddons: addons };
    // }),
    // on(actions.updateAddonsStatus, (state, { updates }) => {
    //     let newAddons = { ...state.installedAddons };
    //     Object.keys(updates).forEach(key => {
    //         newAddons[key] = { ...newAddons[key], beingProcessed: true }
    //     });
    //     return { ...state, installedAddons: newAddons };
    // }),
    // on(actions.updateAddonsStatusEnd, (state, { updates }) => {
    //     let newAddons = { ...state.installedAddons };
    //     Object.keys(updates).forEach(key => {
    //         newAddons[key] = { ...newAddons[key], status:updates[key].status, beingProcessed: false }
    //     });
    //     return { ...state, installedAddons: newAddons };
    // }),
    on(actions.updateInstallationInfo, (state, { info }) => {
        return { ...state, installed: info.addons, loaderMetadata: info.loader }
    }),
    on(actions.fetchAddonsSuccess, (state, { addons, loaderDownloadData }) => {
        return { ...state, addons, loaderDownloadData };
    }),
    on(actions.installAddons, (state, action) => {
        let newAddons = { ...state.addons };

        Object.keys(action.addonsToInstall).forEach(key => {
            newAddons[key] = {...state.addons[key], being_processed: true };
        });
        return { ...state, addons: newAddons }
    }),
    on(actions.installAddonsSuccess, (state, action) => {
        let newAddons = { ...state.addons };
        let installed = { ...state.installed };

        for (let addon of action.addons) {
            newAddons[addon.name] = {...newAddons[addon.name], being_processed: false}
            installed[addon.name] = addon;
        }

        return { ...state, addons: newAddons, installed: installed }
    }),
    on(actions.installAddonsFail, (state, action) => {
        let newAddons = { ...state.addons };
        for (let key of action.addonKeys) {
            newAddons[key] = {...newAddons[key], being_processed: false}
        }
        return { ...state, addons: newAddons }
    })


)