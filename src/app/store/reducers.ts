import { createReducer, on } from '@ngrx/store';
import { AppConfig } from './state';
import * as actions from './actions';

const initialState: AppConfig = {
    gamePath: "",
    lastCheckedHash: ""
};

export const configReducer = createReducer(
    initialState,
    on(actions.updateConfig, (state, { type, ...props }) => ({...state, ...props }))
)