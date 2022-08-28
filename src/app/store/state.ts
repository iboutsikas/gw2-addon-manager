import { AddonState } from "../addons/store/state";

export interface AppConfig {
    gamePath?: string;
    lastCheckedHash?: string;
}

export interface AppState {
    config: AppConfig;
    addons: AddonState
};