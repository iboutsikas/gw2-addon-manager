import { Loader, InstalledAddonMetadata, Addon, LoaderMetaData, Manager } from "@gw2-am/common";

export interface AddonState {
    addons?: Map<string, Addon>;
    installed?: Map<string, InstalledAddonMetadata>;
    loaderMetadata?: LoaderMetaData;
    loaderDownloadData?: Loader;
}
