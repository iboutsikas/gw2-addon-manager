import { createReducer, on } from '@ngrx/store';
import { AppConfig } from './state';
import * as actions from './actions';

const initialState: AppConfig = {
    gamepath: '',
    locale: 'en-US'
};

export const configReducer = createReducer(
    initialState,
    on(actions.updateConfig, (state, { type, ...props }) => ({...state, ...props })),
    on(actions.changeLocale, (state, action) => ({...state, locale: action.newLocale }))
)