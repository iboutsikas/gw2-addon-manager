// export interface AddonHashMap {
//     [key: string] : AddonFromJSON
// }

import { Addon, HashMap, InstalledAddon, Loader, Manager } from "../addons.model";

// export enum AddonStatus {
//     DISABLED,
//     ENABLED
// };

// export interface AddonFromJSON {
//     id: string;
//     name: string;
//     version: string;
//     status: AddonStatus;

//     beingProcessed?: boolean;
// }

// export interface AddonDescription {
//     id: string;
//     name: string;
//     internalName: string;
//     latestVersion: string;
//     authors: string[];

//     status?: AddonStatus
//     installedVersion?: string;
//     needsUpdate?: boolean;
//     beingProcessed?: boolean;
// }
export interface AddonState {
    addons?: HashMap<Addon>;
    loader?: Loader;
    manager?: Manager;
    installed?: HashMap<InstalledAddon>
}
