import { createAction, props } from '@ngrx/store';
import { AppConfig } from './state';

export const loadConfig = createAction(
    '[App] Load Config',
    props<AppConfig>()
);

export const storeConfig = createAction (
    '[App] Store Config',
    props<AppConfig>()
)