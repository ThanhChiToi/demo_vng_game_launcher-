"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWindowControls = registerWindowControls;
const electron_1 = require("electron");
const channels_cjs_1 = require("./channels.cjs");
/**
 * Các nút thu nhỏ / phóng to / đóng của thanh title tự vẽ (BrowserWindow dùng frame: false).
 * Phóng to là toggle, và main process chủ động báo ngược về renderer mỗi khi
 * trạng thái đổi — kể cả khi user double-click thanh title hay kéo cửa sổ lên cạnh màn hình.
 */
function registerWindowControls(window) {
    electron_1.ipcMain.on(channels_cjs_1.CHANNELS.windowMinimize, () => window.minimize());
    electron_1.ipcMain.on(channels_cjs_1.CHANNELS.windowClose, () => window.close());
    electron_1.ipcMain.on(channels_cjs_1.CHANNELS.windowMaximizeToggle, () => {
        if (window.isMaximized()) {
            window.unmaximize();
        }
        else {
            window.maximize();
        }
    });
    electron_1.ipcMain.handle(channels_cjs_1.CHANNELS.windowIsMaximized, () => window.isMaximized());
    const notify = () => {
        if (window.isDestroyed())
            return;
        window.webContents.send(channels_cjs_1.CHANNELS.windowMaximizedChanged, window.isMaximized());
    };
    window.on('maximize', notify);
    window.on('unmaximize', notify);
}
//# sourceMappingURL=windowControls.ipc.cjs.map