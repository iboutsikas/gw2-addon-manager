import { createSelector } from "@ngrx/store";
import { AppState } from "./state";

export const selectAppConfig = (state: AppState) => state.config;

export const selectGamepath = createSelector(
    selectAppConfig,
    (config) => config.gamepath
)

export const selectLocale = createSelector(
    selectAppConfig,
    (config) => config.locale
)
