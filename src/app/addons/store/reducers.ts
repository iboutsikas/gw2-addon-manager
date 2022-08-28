import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as actions from './actions';
import { AddonFromJSON, AddonState } from './state';

const initialState: AddonState = {
    addons: [],
    installedAddons: [],
    disabledAddons: [],
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
    on(actions.updateAddonsInstalled, (state, {type, ...props}) => {
        let mappedAddons: any = {};
        

        return  { ...state, installedAddons: mapToIdAsKey(props) };
    }),
    on(actions.updateAddonsDisabled, (state, {type, ...props}) => {        
        const flat: AddonFromJSON[] = Object.keys(props).map(key => props[key]);
        return  { ...state, disabledAddons: mapToIdAsKey(props) };
    })
)