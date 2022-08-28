export interface AddonHashMap {
    [key: string] : AddonFromJSON
}

export enum AddonStatus {
    DISABLED,
    ENABLED
};

export interface AddonFromJSON {
    id: string;
    name: string;
    version: string;
    status: AddonStatus
}

export interface AddonDescription {
    id: string;
    name: string;
    latestVersion: string;
    authors: string[];

    installedVersion?: string;
    needsUpdate?: boolean;
    installed?: boolean;
    disabled?: boolean
}
export interface AddonState {
    addons: AddonDescription[];
    installedAddons: AddonHashMap
    loading: boolean;
}
