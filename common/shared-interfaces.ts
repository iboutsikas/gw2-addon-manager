export interface InitializationRequirements {
    settings: Boolean,
    magicFile: Boolean,
    loader: Boolean
}

export interface AddonManagerConfig {
    gamePath: string;
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

