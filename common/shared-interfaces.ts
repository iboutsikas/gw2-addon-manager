import { Addon, HashMap } from "./addons/addon-interfaces";

export interface InitializationRequirements {
    settings: Boolean,
    magicFile: Boolean,
    loader: Boolean
}

export interface AddonManagerConfig {
    gamepath: string;
    locale: string;
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


export interface APIResponse 
{
    addons: HashMap<Addon>;
    loader: Loader;
    manager: Manager;
};