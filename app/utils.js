"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInstallAddons = exports.initializeInstallation = void 0;
const path = require("path");
const fs = require("fs-extra");
const fsp = require("node:fs/promises");
const storage = require("electron-json-storage");
const download = require("download");
const admzip = require("adm-zip");
const log = require("electron-log");
const electron_1 = require("electron");
const addon_interfaces_1 = require("./interfaces/addon-interfaces");
const MAGIC_FILENAME = 'gw2addonmanager';
const readInstallationFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = storage.getSync('config');
    const filepath = path.join(config.gamePath, MAGIC_FILENAME);
    const text = yield fsp.readFile(filepath, 'utf8');
    return JSON.parse(text);
});
const initializeInstallation = (gamePath) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if we have the file
    const installationFilePath = path.join(gamePath, MAGIC_FILENAME);
    let installFile = {
        version: 1,
        addons: {}
    };
    // If we do have the file we trust it
    if (fs.existsSync(installationFilePath)) {
        const text = yield fsp.readFile(installationFilePath, 'utf8');
        installFile = JSON.parse(text);
        console.log(`Found installation file at ${installationFilePath}`);
    }
    // If we don't we create it and we check for existing addons
    else {
        // First check for existing addons so we can create the file
        const addonsFolder = path.join(gamePath, 'addons');
        const disabledAddonsFolder = path.join(gamePath, 'disabled-addons');
        if (fs.existsSync(addonsFolder)) {
            const filenames = yield fsp.readdir(addonsFolder);
            for (let name of filenames) {
                console.log(`Found existing addon at ${name}`);
                installFile.addons[name] = { name: name, version: '', status: addon_interfaces_1.AddonStatus.ENABLED };
            }
        }
        else {
            yield fsp.mkdir(addonsFolder);
        }
        if (fs.existsSync(disabledAddonsFolder)) {
            const filenames = yield fsp.readdir(disabledAddonsFolder);
            for (let name of filenames) {
                console.log(`Found existing disabled addon at ${name}`);
                installFile.addons[name] = { name: name, version: '', status: addon_interfaces_1.AddonStatus.DISABLED };
            }
        }
        else {
            yield fsp.mkdir(disabledAddonsFolder);
        }
        const text = JSON.stringify(installFile, null, 2);
        console.log(`Creating file at ${installationFilePath}`);
        yield fsp.writeFile(installationFilePath, text);
    }
    return installFile;
});
exports.initializeInstallation = initializeInstallation;
const handleInstallAddons = (addons) => __awaiter(void 0, void 0, void 0, function* () {
    const config = storage.getSync('config');
    const addonsFolder = path.join(config.gamePath, 'addons');
    const tmpPath = electron_1.app.getPath("temp");
    const succeded = [];
    const failed = [];
    for (let addon of addons) {
        log.info(`Processing addon ${addon.addon_name}`);
        try {
            const downloadPath = path.join(tmpPath, addon.nickname);
            yield download(addon.download_url, downloadPath);
            log.info(`Saved file at: ${downloadPath}`);
            let paths = {};
            paths.download = downloadPath;
            paths.addons = addonsFolder;
            paths.tmp = tmpPath;
            paths.installation = path.join(addonsFolder, addon.nickname);
            if (addon.install_mode === 'binary') {
                yield installBinaryAddon(paths, addon);
            }
            else if (addon.install_mode === 'arc') {
                yield installArcPlugin(paths, addon);
            }
            succeded.push(addon);
        }
        catch (error) {
            log.error(`Error processing ${addon.addon_name}: ${error.message}`);
            failed.push({ addon: addon, reason: error.message });
        }
    }
});
exports.handleInstallAddons = handleInstallAddons;
const updateInstallationFile = (succeeded) => __awaiter(void 0, void 0, void 0, function* () {
    let installationInfo = yield readInstallationFile();
    for (let addon of succeeded) {
        const a = {
            name: addon.nickname,
            status: addon_interfaces_1.AddonStatus.ENABLED,
            version: addon.version_id_is_human_readable ? addon.version_id : addon.version_id.substring(0, 8)
        };
        installationInfo.addons[addon.nickname] = a;
    }
    // const installationFilePath = path.join(gamePath, MAGIC_FILENAME);
});
const installArcPlugin = (paths, addon) => __awaiter(void 0, void 0, void 0, function* () {
    const arcPath = path.join(paths['addons'], 'arcdps');
    if (!fs.existsSync(arcPath)) {
        throw new Error(`Trying to install arc plugin ${addon.addon_name}, but arc is not installed.`);
    }
    if (!addon.download_type) {
        throw new Error(`Addon ${addon.addon_name} has no download type`);
    }
    // All of these plugins need to be installed in the arcdps folder
    paths.installation = path.join(paths.addons, 'arcdps');
    return yield installBinaryAddon(paths, addon);
});
const installBinaryAddon = (paths, addon) => __awaiter(void 0, void 0, void 0, function* () {
    if (!addon.download_type) {
        throw new Error(`Addon ${addon.addon_name} has no download type`);
    }
    if (addon.download_type == 'dll') {
        yield fs.copy(paths['download'], paths.installation, { recursive: true });
    }
    else if (addon.download_type == 'archive') {
        /**
         * Once downloaded we will have a file in the following path:
         * %TEMP%/<addon nickname>/<something>.zip
         * Where <something> depends on the url, so we have to extract
         * that part from the download url
         */
        const archiveName = path.basename(addon.download_url);
        const zipPath = path.join(paths['download'], archiveName);
        let zip = new admzip(zipPath);
        const unzippedPath = `${paths['download']}_extracted`;
        log.info(`Extracting ${zipPath} to ${unzippedPath}`);
        yield zip.extractAllTo(unzippedPath);
        let sourcePath = '';
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
            sourcePath = unzippedPath;
        }
        log.info(`Copying ${sourcePath} to ${paths.installation}`);
        yield fs.copy(sourcePath, paths.installation, { recursive: true });
    }
});
//# sourceMappingURL=utils.js.map