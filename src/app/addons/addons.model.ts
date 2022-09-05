export interface Addon 
{
    developer: string;
    website: string;
    addon_name: string;
    description: string;
    host_type: string;
    host_url: string;
    version_url: string | null;
    download_type? : string;
    install_mode: string;
    requires: string[] | null;
    conflicts: string[] | null;
    nickname: string;
    fetch_time: number;
    version_id: string;
    version_id_is_human_readable: boolean;
    download_url: string;
    being_processed?: boolean;
}

export interface Loader
{
    name: string;
    developer: string;
    website: string;
    version_id: string;
    download_url: string;
    wrapper_nickname: string;
}

export interface Manager
{
    name: string;
    developer: string;
    website: string;
    version_id: string;
    download_url: string;
}

export interface HashMap<TType>
{
    [key: string] : TType
}

export interface APIResponse 
{
    addons: HashMap<Addon>;
    loader: Loader;
    manager: Manager;
};

export enum AddonStatus {
    DISABLED,
    ENABLED
}

export interface InstalledAddon
{
    name: string;
    version_id: string | null;
    status: AddonStatus
}

export interface InstallationInfo {
    version: number;
    addons: HashMap<InstalledAddon>;
}