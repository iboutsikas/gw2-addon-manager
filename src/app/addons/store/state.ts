import { Loader, InstalledAddonMetadata, Addon } from "@gw2-am/common";
import { Manager } from "../addons.model";

export interface AddonState {
    addons?: Map<string, Addon>;
    loader?: Loader;
    manager?: Manager;
    installed?: Map<string, InstalledAddonMetadata>
}
