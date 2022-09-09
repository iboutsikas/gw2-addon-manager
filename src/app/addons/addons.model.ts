import { Loader, Addon } from "@gw2-am/common";

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
    addons: Map<string, Addon>;
    loader: Loader;
    manager: Manager;
};
