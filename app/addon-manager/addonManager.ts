import * as storage from 'electron-json-storage';
import * as fs from 'fs-extra';
import * as fsp from 'node:fs/promises';
import * as path from "path";
import * as download from 'download';
import * as admzip from 'adm-zip'
import * as log from 'electron-log';
import * as semver from 'semver';

import { app } from 'electron';

import { AddonInstaller } from '../addons/addonInstaller';
import { AddonInstallationPaths } from '../interfaces/general-interfaces';
import { Addon, AddonManagerConfig, AddonStatus, createDefaultInstallationInfo, InstallationInfo, InstalledAddonMetadata, Loader } from '../common';
// import { AddonManagerConfig, InstallationInfo, createDefaultInstallationInfo, Addon, Loader, InstalledAddonMetadata, AddonStatus } from '../../common';

const MAGICFILE_FILENAME = 'gw2addonmanager';



export class AddonManager {

    constructor() { }

    public getConfig(): Promise<AddonManagerConfig> {
        const result: Promise<AddonManagerConfig> = new Promise((resolve, reject) => {
            storage.get('config', (err, data: AddonManagerConfig) => {
                if (err) reject(err);

                let config = (Object.keys(data).length != 0) ? data : { gamepath: '', locale: 'en-US' };
                resolve(config);
            })
        })

        return result;
    }

    public saveConfig(config: AddonManagerConfig): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            storage.set('config', config, { prettyPrinting: true }, (error) => {
                if (error)
                    reject(error);

                resolve(true);
            });
        });

        return promise;
    }

    public async readMagicFile(config: AddonManagerConfig | string = null): Promise<InstallationInfo> {
        let gamepath = '';

        if (typeof (config) == "string") {
            gamepath = config;
        }
        else {
            config = config || await this.getConfig();
            gamepath = config.gamepath;
        }

        if (gamepath == '')
            throw new Error('Cannot read magic file when the game path is not initialized');

        const filepath = path.join(gamepath, MAGICFILE_FILENAME);
        const text = await fsp.readFile(filepath, 'utf8');

        return JSON.parse(text);
    }

    public async writeMagicFile(installationInfo: InstallationInfo, gamepath: string = null) {
        if (!gamepath) {
            const config = await this.getConfig();
            gamepath = config.gamepath;
        }

        const filepath = path.join(gamepath, MAGICFILE_FILENAME);
        const text = JSON.stringify(installationInfo, null, 2);
        await fsp.writeFile(filepath, text);
    }

    public async initializeInstance(gamepath): Promise<InstallationInfo> {
        let installationInfo = null;
        try {
            installationInfo = await this.readMagicFile(gamepath);
        } catch (error) {
            // If that errored out, we need to make a new file and everything

            installationInfo = createDefaultInstallationInfo();
            await this.writeMagicFile(installationInfo, gamepath);
            const addonsDir = path.join(gamepath, 'addons');
            if (! await fs.pathExists(addonsDir)) {
                await fsp.mkdir(addonsDir);
            }
            const disabledDir = path.join(gamepath, 'disabled-addons');
            if (! await fs.pathExists(disabledDir)) {
                await fsp.mkdir(disabledDir);
            }
        }
        finally {
            return installationInfo;
        }
    }

    public async initialize(): Promise<any> {
        const result: Promise<any> = new Promise(async (resolve, reject) => {
            const config = await this.getConfig();
            let installationInfo = null;

            if (config.gamepath != '') {
                try {
                    installationInfo = await this.readMagicFile(config);
                }
                catch (err) {
                    log.info('We have a gamepath but no magic file, setup probably failed half-way through. Ingorring for now');
                }
            }

            resolve({ config, installationInfo });
        });

        return result;
    }

    public async installAddons(addons: Addon[], loader?: Loader) {
        const config = await this.getConfig();

        // TODO: Lock this somehow so no parallel shenanigans
        const installationInfo = await this.readMagicFile(config);

        if (loader) {
            const didUpdate = await this.installOrUpdateLoader(config.gamepath, installationInfo, loader);

            if (didUpdate) {
                installationInfo.loader = {
                    installed: true,
                    version: loader.version_id
                }

                await this.writeMagicFile(installationInfo, config.gamepath);
            }
        }


        const tmpPath = app.getPath("temp");
        const installer = new AddonInstaller(config.gamepath);

        const successes: Addon[] = []
        const failures: Addon[] = []

        for (let addon of addons) {
            log.info(`Processing addon ${addon.addon_name}`);

            try {
                const downloadPath = path.join(tmpPath, addon.nickname);
                await download(addon.download_url, downloadPath);
                log.info(`Saved file at: ${downloadPath}`);

                let paths: AddonInstallationPaths = {};

                paths.download = downloadPath;
                paths.tmp = tmpPath;

                await installer.installAddon(addon, paths);
                successes.push(addon)
                log.info(`[AddonManager] Installed addon ${addon.addon_name}`);


            } catch (error) {
                log.error(`Error processing ${addon.addon_name}: ${error.message}`);
                failures.push(addon);
            }
        }


        // Update the magic file
        const metadata = [];
        for (let addon of successes) {
            const newMetadata: InstalledAddonMetadata = {
                name: addon.nickname,
                status: AddonStatus.ENABLED,
                version: addon.version_id
            }

            if (addon.install_mode == 'arc') {
                newMetadata.plugin_type = 'arc';
            }
            
            installationInfo.addons[addon.nickname] = newMetadata;
            metadata.push(newMetadata);
        }

        if (successes.length != 0) {
            log.info('[AddonManager] Updating the magic file');
            await this.writeMagicFile(installationInfo, config.gamepath);
        }
        
        return { successes : metadata, failures: failures.map(a => a.nickname )}
    }

    public async uninstallAddons(addons: Addon[]) {
        const config = await this.getConfig();
        // TODO: Lock this somehow so no parallel shenanigans
        const installationInfo = await this.readMagicFile(config);

        const installer = new AddonInstaller(config.gamepath);
        const successes = [];
        let oneOfTheAddonsWasArc = false;

        for (let addon of addons) {
            const isArcPlugin = addon.install_mode == 'arc';
            const installationPath = isArcPlugin ?
                path.join(config.gamepath, 'addons', 'arcdps') : 
                path.join(config.gamepath, 'addons', addon.nickname);

            if (addon.nickname == 'arcdps')
                oneOfTheAddonsWasArc = true;
            
            let paths: AddonInstallationPaths = {};
            paths.installation = installationPath;
            installer.uninstallAddon(addon, paths);

            delete installationInfo.addons[addon.nickname];
            successes.push(addon.nickname);
        }
        if (oneOfTheAddonsWasArc) {
            // We need to first find the keys and then delete them. Modifying the keys while
            // also iterating them is a bad idea
            const keysToDelete = []
            Object.keys(installationInfo.addons).forEach(key => {
                if (installationInfo.addons[key].plugin_type && installationInfo.addons[key].plugin_type == 'arc') {
                    keysToDelete.push(key)
                    successes.push(key)
                }
            })

            for (let key of keysToDelete) {
                delete installationInfo.addons[key];
            }
        }
        await this.writeMagicFile(installationInfo, config.gamepath);
        return successes;
    }

    private async installOrUpdateLoader(gamepath: string, installationInfo: InstallationInfo, loader: Loader) {
        let needsUpdate = !!!installationInfo.loader;
        if (installationInfo.loader) {
            needsUpdate &&= semver.gt(loader.version_id, installationInfo.loader.version)
        }

        if (!needsUpdate) {
            log.info('[AddonManager] Addon loader does not need update');
            return false;
        }

            log.info('[AddonManager] Need to update addon loader');
            const tmpPath = app.getPath("temp");
            try {
            const downloadPath = path.join(tmpPath, loader.wrapper_nickname);
            await download(loader.download_url, downloadPath);
            log.info(`Saved file at: ${downloadPath}`);

            const archiveName = path.basename(loader.download_url);
            const archivePath = path.join(downloadPath, archiveName);

            let zip = new admzip(archivePath);

            const extractPath = `${downloadPath}_unzipped`;
            log.info(`Extracting ${archivePath} to ${extractPath}`);
            await zip.extractAllTo(extractPath);

            await fs.copy(extractPath, gamepath, { overwrite: true, recursive: true })
            return true;
        }
        catch (err) {
            log.error(`[AddonManager] Failed to install or update loader: ${err}`)
            return false;
        }
    }
}

export const Instance: AddonManager = new AddonManager();