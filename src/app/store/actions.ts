import { createAction, props } from '@ngrx/store';
import { AppConfig } from './state';

export const storeConfig = createAction (
    '[App] Store Config'
)
export const updateConfig = createAction(
    '[App] Update Config',
    props<AppConfig>()
)

export const changeLocale = createAction(
    '[App] Change locale',
    props<{ newLocale: string}>()
)
