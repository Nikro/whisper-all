import { app, BrowserWindow, ipcMain, Tray, Menu, screen } from 'electron';
import { release } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);

process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

app.disableHardwareAcceleration();

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
let tray: Tray | null = null;
let currentView: 'main' | 'settings' | null = null;
const preload = join(__dirname, '../preload/index.mjs');

// Determine the base URL depending on the environment
const isDevelopment = process.env.NODE_ENV === 'development';
const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'; // Vite server URL
const prodUrl = `file://${join(__dirname, '../dist/index.html')}`; // Production URL
const startUrl = isDevelopment ? devUrl : prodUrl;

function createWindow(view: 'main' | 'settings') {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  let windowOptions: Electron.BrowserWindowConstructorOptions;

  if (view === 'main') {
    // Main window: smaller, centered overlay
    const mainWidth = 400;
    const mainHeight = 300;
    windowOptions = {
      width: mainWidth,
      height: mainHeight,
      x: Math.round((width - mainWidth) / 2),
      y: Math.round((height - mainHeight) / 2),
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      webPreferences: {
        preload,
        nodeIntegration: false,
        contextIsolation: true,
      },
    };
  } else {
    // Settings window: larger, standard window
    windowOptions = {
      width: 800,
      height: 600,
      frame: false,
      transparent: false,
      webPreferences: {
        preload,
        nodeIntegration: false,
        contextIsolation: true,
      },
    };
  }

  if (win) {
    if (currentView === view) {
      if (view === 'main') {
        if (win.isVisible()) {
          win.hide();
        } else {
          win.show();
        }
      } else {
        win.focus();
      }
    } else {
      // Close the existing window and create a new one
      win.destroy();
      win = null;
    }
  }

  if (!win) {
    win = new BrowserWindow(windowOptions);

    win.loadURL(startUrl);
    win.webContents.once('did-finish-load', () => {
      console.log(`Sending navigate event for ${view}`);
      win?.webContents.send('navigate', view === 'main' ? '/' : '/settings');
    });
    currentView = view;
    win.on('closed', () => {
      win = null;
    });

    // Add this for debugging
    // if (isDevelopment) {
    //   win.webContents.openDevTools({ mode: 'detach' });
    // }
  }
}

function createTray() {
  try {
    const iconPath = join(process.env.VITE_PUBLIC, 'mic_idle.png');
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Settings', click: () => createWindow('settings') },
      { label: 'Exit', click: () => app.quit() },
    ]);
    tray.setToolTip('WhisperAll');
    tray.setTitle('WhisperAll');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      createWindow('main');
    });
  } catch (error) {
    console.error('Tray could not be created:', error);
  }
}

app.whenReady().then(createTray);

app.on('window-all-closed', (event: { preventDefault: () => void }) => {
  event.preventDefault();
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  if (!win) {
    createWindow('main');
  }
});

app.on('render-process-gone', (event, webContents, details) => {
  console.error('Render process gone:', details.reason);
});

app.on('child-process-gone', (event, details) => {
  console.error('Child process gone:', details.type, details.reason);
});

ipcMain.handle('open-win', (_, arg) => {
  createWindow(arg === 'settings' ? 'settings' : 'main');
});
