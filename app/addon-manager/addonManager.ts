import * as storage from 'electron-json-storage';
import * as fs from 'fs-extra';
import * as fsp from 'node:fs/promises';
import * as path from "path";

import { AddonManagerConfig, InitializationRequirements, InstallationInfo }  from '../../common'

const MAGICFILE_FILENAME = 'gw2addonmanager';



export class AddonManager {
   
    constructor() {}

    public getConfig(): Promise<AddonManagerConfig> {
        const result: Promise<AddonManagerConfig> = new Promise((resolve, reject) => {
            storage.get('config', (err, data) => {
                if (err) reject(err);

                let config = (data) ? data :  { gamepath: '', local: 'en-US' };
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


    public async readMagicFile(config: AddonManagerConfig = null): Promise<InstallationInfo> {
        config = config || await this.getConfig();

        if (config.gamePath.trim() == '')
            throw new Error('Cannot read magic file when the game path is not initialized');

        const filepath = path.join(config.gamePath, MAGICFILE_FILENAME);
        const text = await fsp.readFile(filepath, 'utf8');

        return JSON.parse(text);
    }

    public async requiresInitialization(): Promise<InitializationRequirements> {
        const result: InitializationRequirements = {
            settings: true,
            magicFile: true,
            loader: true
        };
        const config = await this.getConfig();

        result.settings = config.gamePath.trim() == '';

        if (result.settings)
            return result;

        const magicFilePath = path.join(config.gamePath, MAGICFILE_FILENAME);
        result.magicFile = !fs.existsSync(magicFilePath);

        if (result.magicFile)
            return result;

        const magicFile = await this.readMagicFile(config);

        /**
         * The two !! convert magicFile.loader into false if it doesn't exist
         * The third will change the meaning to "do we need to iniitalize this"
         * from "Does this exist"
         */
        result.loader = !!!magicFile.loader;        
        return result;
    }
}

export const Instance: AddonManager = new AddonManager();