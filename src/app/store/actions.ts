import { createAction, props } from '@ngrx/store';
import { AppConfig } from './state';

export const storeConfig = createAction (
    '[App] Store Config',
    props<AppConfig>()
)
export const updateConfig = createAction(
    '[App] Update Config',
    props<AppConfig>()
)