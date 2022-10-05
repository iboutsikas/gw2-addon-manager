import { AddonState } from "../addons/store/state";

export interface AppConfig {
    gamepath?: string;
    locale?: string;
}

export interface AppState {
    config: AppConfig;
    addons: AddonState
};