import { createAction, props } from '@ngrx/store';
import { InitializationRequirements } from '@gw2-am/common/shared-interfaces';
import { AppConfig } from './state';

export const appInitialize = createAction(
    '[App] App Initialize'
)

export const appRequiresInitialization = createAction(
    '[App] Requires initialization',
    props<InitializationRequirements>()
)

export const appIsInitialized = createAction(
    '[App] Is initialized'
)

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
