import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as actions from './actions';
import { AddonState } from './state';

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
    on(actions.fetchAddonsSuccess, (state, { addons, loader }) => {
        return { ...state, addons: addons, loader: loader };
    }),
    on(actions.installAddons, (state, action) => {
        let newAddons = { ...state.addons };
        Object.keys(action.addonsToInstall).forEach(key => {
            newAddons[key] = {...state.addons[key], being_processed: true };
        });
        return { ...state, addons: newAddons }
    })
)