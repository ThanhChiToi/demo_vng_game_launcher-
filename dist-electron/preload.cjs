"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const CHANNELS = {
    windowMinimize: 'window:minimize',
    windowMaximizeToggle: 'window:maximize-toggle',
    windowClose: 'window:close',
    windowIsMaximized: 'window:is-maximized',
    windowMaximizedChanged: 'window:maximized-changed',
    secureStoreAvailable: 'secure-store:available',
    secureStoreGet: 'secure-store:get',
    secureStoreSet: 'secure-store:set',
    secureStoreDelete: 'secure-store:delete',
};
// Chỉ expose đúng những gì renderer cần. contextIsolation đang bật nên
// renderer không với tới được Node API nào khác ngoài object này.
const api = {
    minimize: () => electron_1.ipcRenderer.send(CHANNELS.windowMinimize),
    maximizeToggle: () => electron_1.ipcRenderer.send(CHANNELS.windowMaximizeToggle),
    close: () => electron_1.ipcRenderer.send(CHANNELS.windowClose),
    isMaximized: () => electron_1.ipcRenderer.invoke(CHANNELS.windowIsMaximized),
    onMaximizedChange: (listener) => {
        const handler = (_event, maximized) => listener(maximized);
        electron_1.ipcRenderer.on(CHANNELS.windowMaximizedChanged, handler);
        return () => electron_1.ipcRenderer.off(CHANNELS.windowMaximizedChanged, handler);
    },
    secureStore: {
        isAvailable: () => electron_1.ipcRenderer.invoke(CHANNELS.secureStoreAvailable),
        get: (key) => electron_1.ipcRenderer.invoke(CHANNELS.secureStoreGet, key),
        set: (key, value) => electron_1.ipcRenderer.invoke(CHANNELS.secureStoreSet, key, value),
        delete: (key) => electron_1.ipcRenderer.invoke(CHANNELS.secureStoreDelete, key),
    },
};
electron_1.contextBridge.exposeInMainWorld('electronAPI', api);
//# sourceMappingURL=preload.cjs.map