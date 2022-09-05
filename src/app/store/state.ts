import { AddonState } from "../addons/store/state";

export interface AppConfig {
    gamePath?: string;
    locale?: string;
}

export interface AppState {
    config: AppConfig;
    addons: AddonState
};