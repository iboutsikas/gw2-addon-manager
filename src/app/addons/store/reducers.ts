import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as actions from './actions';
import { AddonFromJSON, AddonState, AddonStatus } from './state';

const initialState: AddonState = {
    addons: [],
    installedAddons: {},
    loading: false
};

const mapToIdAsKey= (props: ReadonlyArray<AddonFromJSON>): any => {
    let result: any = {};

    Object.keys(props).forEach(key => {
        const addon = props[key];
        result[addon.id] = addon;
    });

    return result;
}

export const addonsReducer = createReducer(
    initialState,
    on(actions.updateAddonsInstalled, (state, { updates }) => {
        return  { ...state, installedAddons: updates };
    }),
    on(actions.markAddonsEnabled, (state, { updates }) => {    
        let newAddons = {... state.installedAddons };    
        Object.keys(updates).forEach(key =>
            newAddons[key].status = AddonStatus.ENABLED
        );
        return  { ...state,  installedAddons: newAddons };
    }),
    on(actions.markAddonsDisabled, (state, { updates }) => {    
        let newAddons = {... state.installedAddons };    
        Object.keys(updates).forEach(key =>
            newAddons[key].status = AddonStatus.DISABLED
        );
        return  { ...state,  installedAddons: newAddons };
    }),
    on(actions.fetchAddonsSuccess, (state, { addons }) => {
        console.log(addons);
        return { ... state, addons: addons };
    })
)