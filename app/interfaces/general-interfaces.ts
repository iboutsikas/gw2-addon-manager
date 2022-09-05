export interface AddonManagerConfig {
    gamePath: string;
    locale: string;
}

export interface AddonInstallationPaths {
    download? : string;
    addons?: string;
    tmp?: string;
    installation?: string;
}