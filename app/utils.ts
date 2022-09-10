import * as path from "path";
import * as fs from 'fs-extra';
import * as fsp from 'node:fs/promises';
import * as storage from 'electron-json-storage';
import * as download from 'download';
import * as admzip from 'adm-zip'
import * as log from 'electron-log';

import { app } from 'electron';


import { AddonInstallationPaths } from "./interfaces/general-interfaces";
import { AddonInstaller } from "./addons/addonInstaller";
import { InstallationInfo, InstalledAddonMetadata, AddonStatus, Addon } from "../common";

const MAGIC_FILENAME = 'gw2addonmanager';

const readInstallationFile = async () => {
    const config = storage.getSync('config');
    const filepath = path.join(config.gamePath, MAGIC_FILENAME);

    const text = await fsp.readFile(filepath, 'utf8');
    return JSON.parse(text);
}

export const initializeInstallation = async (gamePath) => {
    // Check if we have the file
    const installationFilePath = path.join(gamePath, MAGIC_FILENAME);

    let installFile: InstallationInfo = {
        version: 1,
        addons: new Map<string, InstalledAddonMetadata>()
    };

    // If we do have the file we trust it
    if (fs.existsSync(installationFilePath)) {
        const text = await fsp.readFile(installationFilePath, 'utf8');
        installFile = JSON.parse(text);
        console.log(`Found installation file at ${installationFilePath}`);
    }
    // If we don't we create it and we check for existing addons
    else {
        // First check for existing addons so we can create the file
        const addonsFolder = path.join(gamePath, 'addons');
        const disabledAddonsFolder = path.join(gamePath, 'disabled-addons');
        if (fs.existsSync(addonsFolder)) {
            const filenames = await fsp.readdir(addonsFolder);
            for (let name of filenames) {
                console.log(`Found existing addon at ${name}`);
                installFile.addons[name] = { name: name, version: '', status: AddonStatus.ENABLED };
            }
        }
        else {
            await fsp.mkdir(addonsFolder);
        }

        if (fs.existsSync(disabledAddonsFolder)) {
            const filenames = await fsp.readdir(disabledAddonsFolder);
            for (let name of filenames) {
                console.log(`Found existing disabled addon at ${name}`);
                installFile.addons[name] = { name: name, version: '', status: AddonStatus.DISABLED };
            }
        }
        else {
            await fsp.mkdir(disabledAddonsFolder);
        }
        const text = JSON.stringify(installFile, null, 2);
        console.log(`Creating file at ${installationFilePath}`)
        await fsp.writeFile(installationFilePath, text);
    }

    return installFile;
}

export const handleInstallAddons = async (addons: Addon[]) => {
    const config = storage.getSync('config');

    const tmpPath = app.getPath("temp");
    const installer = new AddonInstaller(config.gamePath);



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

        } catch (error) {
            log.error(`Error processing ${addon.addon_name}: ${error.message}`);
        }
    }
}

const updateInstallationFile = async (succeeded: Addon[]) => {
    let installationInfo: InstallationInfo = await readInstallationFile();

    for(let addon of succeeded) {
        const a: InstalledAddonMetadata = {
            name: addon.nickname,
            status: AddonStatus.ENABLED,
            version: addon.version_id_is_human_readable ?  addon.version_id  : addon.version_id.substring(0, 8)
        };
        installationInfo.addons[addon.nickname] = a;
    }

    // const installationFilePath = path.join(gamePath, MAGIC_FILENAME);
}


const installArcPlugin = async (paths:AddonInstallationPaths, addon: Addon) => {
    const arcPath = path.join(paths['addons'], 'arcdps');

    if (!fs.existsSync(arcPath)) {
        throw new Error(`Trying to install arc plugin ${addon.addon_name}, but arc is not installed.`);
    }

    if (!addon.download_type) {
        throw new Error(`Addon ${addon.addon_name} has no download type`);
    }
    
    // All of these plugins need to be installed in the arcdps folder
    paths.installation = path.join(paths.addons, 'arcdps');

    return await installBinaryAddon(paths, addon);
}

const installBinaryAddon = async (paths:AddonInstallationPaths, addon: Addon) => {
    if (!addon.download_type) {
        throw new Error(`Addon ${addon.addon_name} has no download type`);
    }

    if (addon.download_type == 'dll') {
        await fs.copy(paths['download'], paths.installation, { recursive: true });
    }
    else if (addon.download_type == 'archive') {

        /**
         * Once downloaded we will have a file in the following path:
         * %TEMP%/<addon nickname>/<something>.zip
         * Where <something> depends on the url, so we have to extract
         * that part from the download url
         */
        const archiveName = path.basename(addon.download_url)

        const zipPath = path.join(paths['download'], archiveName);
        let zip = new admzip(zipPath);

        const unzippedPath = `${paths['download']}_extracted`;
        log.info(`Extracting ${zipPath} to ${unzippedPath}`);
        await zip.extractAllTo(unzippedPath);

        let sourcePath = ''
        if (fs.existsSync(path.join(unzippedPath, addon.nickname))) {
            /**
             * The zip contains a folder with the contents of the addon, so for example:
             *  gw2radial/
             *    - gw2radial.dll
             * so we need to copy the contents of that folder to the addons folder
             */ 
            sourcePath = path.join(unzippedPath, addon.nickname);
        }
        else {
            /**
             * The archive contains just the contents of the addon, so we copy from
             * the extracted folder directly
             */
            sourcePath = unzippedPath
        }

        log.info(`Copying ${sourcePath} to ${paths.installation}`)
        await fs.copy(sourcePath, paths.installation, { recursive: true });
    }
}