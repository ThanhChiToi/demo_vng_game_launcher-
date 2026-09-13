import { contextBridge, ipcRenderer } from 'electron';

// Expose các API an toàn ra cửa sổ trình duyệt (window object của React)
contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
});