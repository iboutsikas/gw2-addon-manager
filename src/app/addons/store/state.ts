export interface AddonDescription {
    name: string;
    installedVersion?: string;
    latestVersion?: string;
    author?: string;
    needsUpdate: boolean;
    installed: boolean;
}
export interface AddonState {
    addons: ReadonlyArray<AddonDescription>;
    loading: boolean;
}