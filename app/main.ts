import {app, BrowserWindow, shell, ipcMain} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as storage from 'electron-json-storage';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';

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

  win.webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () =>  {
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

  // app.whenReady().then(() => {
  //   installExtension(REDUX_DEVTOOLS)
  //     .then((name) => console.log(`Added Extension:  ${name}`))
  //     .catch((err) => console.log('An error occurred: ', err));
  // });

} catch (e) {
  // Catch Error
  // throw e;
}
