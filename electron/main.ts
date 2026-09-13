import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    frame: false,
    show: false,
    webPreferences: {
      // Khi build, preload.js sẽ nằm chung thư mục dist-electron với main.js
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Trỏ chính xác ra thư mục dist chứa index.html
    mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  ipcMain.on('window-minimize', () => mainWindow?.minimize());
  ipcMain.on('window-close', () => mainWindow?.close());
});