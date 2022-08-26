export interface AppConfig {
    gamePath?: string;
    lastCheckedHash?: string;
}

export interface AppState {
    config: AppConfig;
};