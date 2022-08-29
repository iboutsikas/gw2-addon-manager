import { app, BrowserWindow, shell, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as fsp from 'node:fs/promises';
import * as storage from 'electron-json-storage';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import { InstallationInfo } from './interfaces/addon-interfaces';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {
  const width = 1130;
  const height = 600;

  // Create the browser window.
  win = new BrowserWindow({
    width: width,
    height: height,
    center: true,
    resizable: false,
    icon: path.join(__dirname, '../src/favicon.ico'),
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

const createInstallationFilesAndDirectories = async (fileContents, gamePath) => {
  // Make the installation file first
  const installationFilePath = path.join(gamePath, 'gw2addonmanager');

  const json = JSON.stringify(fileContents, null, 2);
  await fsp.writeFile(installationFilePath, json);
  console.log(`Wrote ${installationFilePath}`);

  // Since this might be a completely new installation,
  // let's also make a couple of directories we will need
  const addonsDirectory = path.join(gamePath, 'addons');
  const disabledAddonsDirectory = path.join(gamePath, 'disabled-addons');

  if (!fs.existsSync(addonsDirectory)) {
    fs.mkdirSync(addonsDirectory);
  }

  if (!fs.existsSync(disabledAddonsDirectory)) {
    fs.mkdirSync(disabledAddonsDirectory);
  }
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    storage.setDataPath(app.getPath('userData'));
    setTimeout(createWindow, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('close-application', (evt, arg) => {
    app.quit();
  });

  ipcMain.on('minimize-application', (evt, args) => {
    win.minimize();
  });

  ipcMain.handle('load-config', async (event) => {
    let config =  storage.getSync('config');
    
    const hasKeys = !!Object.keys(config).length;
    if (!hasKeys) {
      console.log('Initializing config for the first time');
      // First time running, let's initialize
      config = {
        gamePath: '',
        lastCheckedHash: ''
      }

      storage.set('config', config, { prettyPrinting: true }, function (error) {
        if (error) throw error;
      });
    }
    
    return config;
  });

  ipcMain.handle('save-config', async (event, config) => {
    console.log('Saving settings', config);
    storage.set('config', config, { prettyPrinting: true }, function (error) {
      if (error) throw error;
    })

    return 1;
  });

  ipcMain.handle('initialize-installation', async (event, gamePath) => {
    const installationFilePath = path.join(gamePath, 'gw2addonmanager');

    let installFile: InstallationInfo = {
      version: 1,
      addons: []
    };

    try {
      const text = await fsp.readFile(installationFilePath, 'utf8');
      installFile = JSON.parse(text);
      console.log(`Found installation file at ${installationFilePath}`);
    } catch(e) {
      if (e.code !== 'ENOENT')
        throw e;
        console.log('This appears to be a new GW2 installation. Setting up files...');
        await createInstallationFilesAndDirectories(installFile, gamePath);
    } finally {
      return installFile;
    }

  });

  ipcMain.handle('update-addon-status', async (event, changes) => {
    const config =  storage.getSync('config');
    const gamePath = config.gamePath;


    const result = {};

    for (let change of changes) {
      let sourcePath;
      let destinationPath;

      if (change.status == 0) {
        sourcePath = path.join(gamePath, 'addons', change.internalName);
        destinationPath = path.join(gamePath, 'disabled-addons', change.internalName);
      }
      else if (change.status == 1){
        sourcePath = path.join(gamePath, 'disabled-addons', change.internalName);
        destinationPath = path.join(gamePath, 'addons', change.internalName);
      }
      try {
        console.log(`Copying ${sourcePath} to ${destinationPath}`);
        await fsp.rename(sourcePath, destinationPath);
        console.log('Copy done.')
        result[change.id] = change.status;
      } catch (e) {
        console.log(`Copy failed: ${e.message}`);
        // Reset the status change and send it back
        result[change.id] = change.status == 0 ? 1 : 0;
      }
    }

    // Update the installation file
    const installationFilePath = path.join(gamePath, 'gw2addonmanager');
    const text = await fsp.readFile(installationFilePath, 'utf8');
    let installationInfo: InstallationInfo = JSON.parse(text);    
    for(let addon of installationInfo.addons) {
      if (addon.id in result) {
        addon.status = result[addon.id];
      }
    }
    
    const json = JSON.stringify(installationInfo, null, 2);
    await fsp.writeFile(installationFilePath, json);
    
    return result;
  });

  app.whenReady().then(() => {
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  });

} catch (e) {
  // Catch Error
  // throw e;
}
