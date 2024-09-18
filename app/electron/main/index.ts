import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
import { release } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);

const DIST_ELECTRON = join(__dirname, '../');
const DIST = join(DIST_ELECTRON, '../dist');
const VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(DIST_ELECTRON, '../public')
  : DIST;

app.disableHardwareAcceleration();

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let tray: Tray | null = null;
const preload = join(__dirname, '../preload/index.mjs');

// Determine the base URL depending on the environment
const isDevelopment = !app.isPackaged;
const startUrl = isDevelopment
  ? process.env.VITE_DEV_SERVER_URL!
  : `file://${join(DIST, 'index.html')}`;

let mainWin: BrowserWindow | null = null;
let settingsWin: BrowserWindow | null = null;

function createWindows() {
  // Main Window
  mainWin = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWin.loadURL(`${startUrl}#/`);
  mainWin.on('closed', () => {
    mainWin = null;
  });

  // Settings Window
  settingsWin = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: false,
    show: false,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  settingsWin.loadURL(`${startUrl}#/settings`);
  settingsWin.on('closed', () => {
    settingsWin = null;
  });
}

function toggleWindow(view: 'main' | 'settings') {
  if (view === 'main') {
    if (mainWin) {
      if (mainWin.isVisible()) {
        mainWin.hide();
      } else {
        settingsWin?.hide();
        mainWin.show();
        mainWin.focus();
      }
    }
  } else if (view === 'settings') {
    if (settingsWin) {
      if (settingsWin.isVisible()) {
        settingsWin.hide();
      } else {
        mainWin?.hide();
        settingsWin.show();
        settingsWin.focus();
      }
    }
  }
}

function createTray() {
  try {
    const iconPath = join(VITE_PUBLIC, 'mic_idle.png');
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Settings', click: () => toggleWindow('settings') },
      { label: 'Exit', click: () => app.quit() },
    ]);
    tray.setToolTip('WhisperAll');
    tray.setTitle('WhisperAll');
    tray.setContextMenu(contextMenu);

    let trayClickTimeout: NodeJS.Timeout | null = null;

    tray.on('click', () => {
      if (trayClickTimeout) return;
      toggleWindow('main');
      trayClickTimeout = setTimeout(() => {
        trayClickTimeout = null;
      }, 300);
    });
  } catch (error) {
    console.error('Tray could not be created:', error);
  }
}

app.whenReady().then(() => {
  createWindows();
  createTray();
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
});

app.on('before-quit', () => {
  mainWin?.destroy();
  settingsWin?.destroy();
});

app.on('second-instance', () => {
  if (mainWin && mainWin.isVisible()) {
    if (mainWin.isMinimized()) mainWin.restore();
    mainWin.focus();
  } else if (settingsWin && settingsWin.isVisible()) {
    if (settingsWin.isMinimized()) settingsWin.restore();
    settingsWin.focus();
  }
});

app.on('activate', () => {
  if (!mainWin && !settingsWin) {
    createWindows();
  }
});

const NAVIGATE_CHANNEL = 'navigate';

ipcMain.handle(NAVIGATE_CHANNEL, (_, arg) => {
  toggleWindow(arg === 'settings' ? 'settings' : 'main');
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
