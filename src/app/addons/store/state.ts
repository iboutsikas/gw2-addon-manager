import { Loader, InstalledAddonMetadata, Addon, LoaderMetaData, Manager } from "@gw2-am/common";

export interface AddonState {
    addons?: Map<string, Addon>;
    loader?: Loader;
    manager?: Manager;
    installed?: Map<string, InstalledAddonMetadata>;
    loaderMetadata?: LoaderMetaData;
}
