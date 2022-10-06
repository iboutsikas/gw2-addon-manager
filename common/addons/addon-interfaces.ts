export enum AddonStatus {
    DISABLED,
    ENABLED
};

export interface InstalledAddonMetadata {
    name: string;
    version: string;
    status: AddonStatus,
    plugin_type?: string;
}

export interface LoaderMetaData {
    installed: Boolean;
    version: string;
}

export interface InstallationInfo {
    version: number;
    addons: HashMap<InstalledAddonMetadata>;
    loader?: LoaderMetaData;
}

export interface Addon {
    developer: string;
    website: string;
    addon_name: string;
    description: string;
    host_type: string;
    host_url: string;
    version_url: string | null;
    download_type?: string;
    install_mode: string;
    requires: string[] | null;
    conflicts: string[] | null;
    nickname: string;
    fetch_time: number;
    version_id: string;
    version_id_is_human_readable: boolean;
    download_url: string;
    being_processed?: boolean;
    files? : string[];
    plugin_name_pattern?: string;
    plugin_name?: string;
}

export interface HashMap<TValue> {
    [key: string]: TValue;
}
