export enum AddonStatus {
    DISABLED,
    ENABLED
};

export interface AddonJSON {
    id: string;
    name: string;
    version: string;
    status: AddonStatus
}

export interface InstallationInfo {
    version: number;
    addons: AddonJSON[];
}