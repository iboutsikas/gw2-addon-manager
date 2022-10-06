# Introduction

This is a remake of the Unofficial GW2 Addon manager using Angular + Electron.
For now the project attempts to look similar to the original to be more
familiar, but that can easily change. This is still an early release, so fill
free to open pull requests and whatnot.

## Planned features
The app is already designed to allow enabling/disabling addons without having to
uninstall them (think of patch day and arc has still not updated, you are
dropping frames, and you are sad). This functionality is disabled for now as I
had to rework quite a few things.

**Dependency resolution**: I really want to include this feature but I don't have a
good idea on how to do it. Would definitely appreciate some pull requests there.

**Translations**: The application is already mostly setup with translation in
mind. There are still a few strings to be extracted, and then I would need some
native speakers providing assistance to whatever language they want.

**Auto-updates**: The plan is to use github releases with `electron-updater` or
something. Also a WIP.

## Testing the released binaries

If you want to test the already compiled application, you can create a folder
anywhere you want and copy `Gw2-64.exe` into that folder. The application will
check for the existence of that file in the given game path. From there you can
install/uninstall addons as you see fit, to test.

### There is no dependency resolution for now. If you add an ArcDPS plugin without having ArcDPS already installed, it won't work.


## Getting Started

*Clone this repository locally:*

``` bash
git clone https://github.com/iboutsikas/gw2-addon-manager.git
```

*Install dependencies with npm (used by Electron renderer process):*

``` bash
npm install
```

There is an issue with `yarn` and `node_modules` when the application is built by the packager. Please use `npm` as dependencies manager.

If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

*Install NodeJS dependencies with npm (used by Electron main process):*

``` bash
cd app/
npm install
```

Why two package.json ? This project follow [Electron Builder two package.json structure](https://www.electron.build/tutorials/two-package-structure) in order to optimize final bundle and be still able to use Angular `ng add` feature.

## To build for development

- **in a terminal window** -> npm start

Voila! You can use your Angular + Electron app in a local development environment with hot reload!

The application code is managed by `app/main.ts`. In this sample, the app runs
with a simple Angular App (http://localhost:4200), and an Electron window. The
Angular component contains an example of Electron and NodeJS native lib import.
You can disable "Developer Tools" by commenting
`win.webContents.openDevTools();` in `app/main.ts`.

Please note that the web version is **NOT** actually viable, as it needs to be
running within electron to access your file system.

## Project structure

| Folder | Description                                      |
|--------|--------------------------------------------------|
| app    | Electron main process folder (NodeJS)            |
| src    | Electron renderer process folder (Web / Angular) |



## Included Commands

| Command                  | Description                                                                                           |
|--------------------------|-------------------------------------------------------------------------------------------------------|
| `npm run ng:serve`       | Execute the app in the web browser (DEV mode)                                                         |
| `npm run web:build`      | Build the app that can be used directly in the web browser. Your built files are in the /dist folder. |
| `npm run electron:local` | Builds your application and start electron locally                                                    |
| `npm run electron:build` | Builds your application and creates an app consumable based on your operating system                  |

**Your application is optimized. Only /dist folder and NodeJS dependencies are included in the final bundle.**



## Debug with VsCode

[VsCode](https://code.visualstudio.com/) debug configuration is available! In order to use it, you need the extension [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).

Then set some breakpoints in your application's source code.

Finally from VsCode press **Ctrl+Shift+D** and select **Application Debug** and press **F5**.

Please note that Hot reload is only available in Renderer process.