export enum AddonStatus {
    DISABLED,
    ENABLED
};

export interface AddonJSON {
    name: string;
    version: string;
    status: AddonStatus
}

export interface InstallationInfo {
    version: number;
    addons: { [key: string] : AddonJSON };
}