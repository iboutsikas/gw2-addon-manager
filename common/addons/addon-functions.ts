import { InstallationInfo, InstalledAddonMetadata } from "./addon-interfaces"

export const createDefaultInstallationInfo = () : InstallationInfo => {
    const result: InstallationInfo = {
        version: 1,
        addons: new Map<string, InstalledAddonMetadata>()
    };

    return result;
}