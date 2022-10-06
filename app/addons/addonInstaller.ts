import * as admzip from 'adm-zip';
import * as fs from 'fs-extra';
import * as fsp from 'node:fs/promises';
import * as log from 'electron-log';
import * as path from 'path';


import { AddonInstallationPaths } from "../interfaces/general-interfaces";
import { Addon } from '../common';


export class AddonInstaller {

    constructor(private gamepath: string) {

    }

    private async handleArchive(addon: Addon, paths: AddonInstallationPaths): Promise<string> {
        /**
         * Once downloaded we will have a file in the following path:
         * %TEMP%/<addon nickname>/<something>.zip
         * Where <something> depends on the url, so we have to extract
         * that part from the download url
         */
        const archiveName = path.basename(addon.download_url);
        const zipPath = path.join(paths.download, archiveName);

        const zip = new admzip(zipPath);
        const unzippedPath = `${paths.download}_extracted`;

        log.info(`Extracting ${zipPath} to ${unzippedPath}`);

        await zip.extractAllTo(unzippedPath);

        const subfolder = path.join(unzippedPath, addon.nickname);

        /**
         * If the subfolder exists we need to copy from in there.
         * Otherwise the archive contained the binary files only
         * and we can copy those directly
         */
        return fs.existsSync(subfolder) ? subfolder : unzippedPath;
    }

    /**
     * paths parameter should have the download and tmp properties filled
     * @param addon The addon to be installed
     * @param paths An object containing some paths used in installation
     */
    public async installAddon(addon: Addon, paths: AddonInstallationPaths) {

        if (!addon.download_type) {
            throw new Error(`Addon ${addon.addon_name} has no download type`);
        }

        paths.addons = path.join(this.gamepath, 'addons');

        // Arc plugins need to be copied in the arcdps folder
        paths.installation = addon.install_mode === 'arc' ?
            path.join(paths.addons, 'arcdps') :
            path.join(paths.addons, addon.nickname);

        let sourcepath = '';

        switch (addon.download_type) {
            case 'dll': {
                sourcepath = paths.download;
                break;
            }
            case 'archive': {
                sourcepath = await this.handleArchive(addon, paths);
                break;
            }
            default:
                throw new Error(`Unknown download type ${addon.download_type}`);
        }

        await fs.copy(sourcepath, paths.installation, { recursive: true })
    }

    public async uninstallAddon(addon: Addon, paths: AddonInstallationPaths) {
        const isArcPlugin = addon.install_mode == 'arc';

        const files = addon.files || [];

        for (let file of files) {
            const filepath = path.join(paths.installation, file);
            try {
                log.info(`[AddonInstaller] Deleting ${filepath}`);
                await fsp.unlink(filepath);
            }
            catch(err) {
                log.warn(`[AddonInstaller] Could not delete ${filepath}`);
            }
        }

        if (isArcPlugin) {
            const files = await fsp.readdir(paths.installation);
            for (let file of files) {
                const filepath = path.join(paths.installation, file);
                const filepattern = addon.plugin_name 
                                || addon.plugin_name_pattern.slice(0, -1)
                                || '';
                if (filepath.includes(filepattern)) {
                    await fsp.unlink(filepath);
                }
            }
        }
        else {
            // else just delete the folder
            try {
                await fsp.rm(paths.installation, {recursive: true});
            }
            catch (err) {
                log.error(err);
            }
        }
    }
}