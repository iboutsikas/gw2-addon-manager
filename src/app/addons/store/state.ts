import { Loader, InstalledAddonMetadata, Addon, LoaderMetaData, Manager, HashMap } from "@gw2-am/common";

export interface AddonState {
    addons?: HashMap<Addon>;
    installed?: HashMap<InstalledAddonMetadata>;
    loaderMetadata?: LoaderMetaData;
    loaderDownloadData?: Loader;
}
