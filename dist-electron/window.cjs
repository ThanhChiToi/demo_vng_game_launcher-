"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainWindow = getMainWindow;
exports.createMainWindow = createMainWindow;
exports.focusMainWindow = focusMainWindow;
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const windowControls_ipc_cjs_1 = require("./ipc/windowControls.ipc.cjs");
// Khi chạy dev, nạp từ Vite dev server để có HMR.
// Ghi đè bằng biến môi trường VITE_DEV_SERVER_URL nếu đổi port.
const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL ?? (electron_1.app.isPackaged ? null : 'http://localhost:5173');
let mainWindow = null;
function getMainWindow() {
    return mainWindow;
}
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 940,
        minHeight: 600,
        backgroundColor: '#121212',
        frame: false,
        show: false,
        webPreferences: {
            // Khi build, preload.cjs nằm chung thư mục dist-electron với main.cjs
            preload: node_path_1.default.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
            // Ghi rõ cho khỏi quên: preload chạy trong sandbox nên KHÔNG require được
            // file cục bộ. Mọi thứ preload cần phải nằm gọn trong chính preload.cts.
            sandbox: true,
        },
    });
    (0, windowControls_ipc_cjs_1.registerWindowControls)(mainWindow);
    if (DEV_SERVER_URL) {
        void mainWindow.loadURL(DEV_SERVER_URL);
    }
    else {
        void mainWindow.loadFile(node_path_1.default.resolve(__dirname, '../dist/index.html'));
    }
    mainWindow.once('ready-to-show', () => mainWindow?.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    return mainWindow;
}
/** Khi user mở app lần thứ hai: khôi phục và đưa cửa sổ đang có lên trước. */
function focusMainWindow() {
    if (!mainWindow)
        return;
    if (mainWindow.isMinimized())
        mainWindow.restore();
    mainWindow.focus();
}
//# sourceMappingURL=window.cjs.map