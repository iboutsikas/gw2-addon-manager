export interface AddonHashMap {
    [key: number] : AddonFromJSON
}

export interface AddonFromJSON {
    id: number;
    name: string;
    version: string;
}

export interface AddonDescription {
    id: number;
    name: string;
    installedVersion?: string;
    latestVersion?: string;
    author?: string;
    needsUpdate: boolean;
    installed: boolean;
    disabled?: boolean
}
export interface AddonState {
    addons: AddonDescription[];
    installedAddons: AddonHashMap,
    disabledAddons: AddonHashMap
    loading: boolean;
}
