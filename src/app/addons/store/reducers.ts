import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as actions from './actions';
import { AddonFromJSON, AddonState, AddonStatus } from './state';

const initialState: AddonState = {
    addons: [],
    installedAddons: {},
    loading: false
};

const mapToIdAsKey = (props: ReadonlyArray<AddonFromJSON>): any => {
    let result: any = {};

    Object.keys(props).forEach(key => {
        const addon = props[key];
        result[addon.id] = addon;
    });

    return result;
}

export const addonsReducer = createReducer(
    initialState,
    on(actions.addAddonsInstalled, (state, { updates }) => {
        const addons = { ...state.installedAddons, ...updates };
        return { ...state, installedAddons: addons };
    }),
    on(actions.removeAddonsInstalled, (state, { updates }) => {
        const addons = { ...state.installedAddons };

        Object.keys(updates).forEach(key => {
            delete (addons[key]);
        });

        return { ...state, installedAddons: addons };
    }),
    on(actions.updateAddonsStatus, (state, { updates }) => {
        let newAddons = { ...state.installedAddons };
        Object.keys(updates).forEach(key => {
            newAddons[key] = { ...newAddons[key], status: updates[key].status }
        });
        return { ...state, installedAddons: newAddons };
    }),
    on(actions.fetchAddonsSuccess, (state, { addons }) => {
        console.log(addons);
        return { ...state, addons: addons };
    })
)