import { createAction, props } from '@ngrx/store';
import { AddonFromJSON } from './state';


export const updateAddonsInstalled = createAction(
    '[Addons] Update installed addons',
    props<ReadonlyArray<AddonFromJSON>>()
)

export const updateAddonsDisabled = createAction(
    '[Addons] Update disabled addons',
    props<ReadonlyArray<AddonFromJSON>>()
)