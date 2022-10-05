import * as storage from 'electron-json-storage';
import * as fs from 'fs-extra';
import * as fsp from 'node:fs/promises';
import * as path from "path";
import * as log from 'electron-log';

import { AddonManagerConfig, createDefaultInstallationInfo, InitializationRequirements, InstallationInfo }  from '../../common'

const MAGICFILE_FILENAME = 'gw2addonmanager';



export class AddonManager {
   
    constructor() {}

    public getConfig(): Promise<AddonManagerConfig> {
        const result: Promise<AddonManagerConfig> = new Promise((resolve, reject) => {
            storage.get('config', (err, data: AddonManagerConfig) => {
                if (err) reject(err);

                let config = (Object.keys(data).length != 0) ? data :  { gamepath: '', locale: 'en-US' };
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

        if (typeof(config) == "string") {
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
                catch(err) {
                    log.info( 'We have a gamepath but no magic file, setup probably failed half-way through. Ingorring for now');
                }
            }

            resolve({ config, installationInfo });
        });

        return result;
    }
}

export const Instance: AddonManager = new AddonManager();