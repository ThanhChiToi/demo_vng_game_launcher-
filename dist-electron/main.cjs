"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const security_cjs_1 = require("./security.cjs");
const secureStore_ipc_cjs_1 = require("./ipc/secureStore.ipc.cjs");
const window_cjs_1 = require("./window.cjs");
// Launcher chỉ được phép chạy một bản. Nếu user bấm mở lần nữa thì
// đưa cửa sổ đang có lên trước thay vì mở thêm một app mới.
if (!electron_1.app.requestSingleInstanceLock()) {
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', window_cjs_1.focusMainWindow);
    (0, security_cjs_1.allowSelfSignedLocalhostInDev)(electron_1.app);
    void electron_1.app.whenReady().then(() => {
        (0, secureStore_ipc_cjs_1.registerSecureStore)();
        (0, window_cjs_1.createMainWindow)();
        // macOS: bấm vào icon ở Dock khi không còn cửa sổ nào thì mở lại.
        electron_1.app.on('activate', () => {
            if (electron_1.BrowserWindow.getAllWindows().length === 0)
                (0, window_cjs_1.createMainWindow)();
        });
    });
    // Windows/Linux: đóng hết cửa sổ là thoát hẳn. macOS thì app vẫn sống ở Dock.
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            electron_1.app.quit();
    });
}
//# sourceMappingURL=main.cjs.map