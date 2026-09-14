"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSecureStore = registerSecureStore;
const electron_1 = require("electron");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const channels_cjs_1 = require("./channels.cjs");
let cache = null;
const vaultPath = () => node_path_1.default.join(electron_1.app.getPath('userData'), 'secure-store.json');
async function load() {
    if (cache)
        return cache;
    try {
        const raw = await node_fs_1.promises.readFile(vaultPath(), 'utf8');
        const parsed = JSON.parse(raw);
        cache = typeof parsed === 'object' && parsed !== null ? parsed : {};
    }
    catch {
        // Chưa có file, hoặc file hỏng -> coi như kho rỗng.
        cache = {};
    }
    return cache;
}
async function persist(vault) {
    cache = vault;
    const file = vaultPath();
    // Electron thường tạo sẵn userData, nhưng nếu chưa có thì writeFile sẽ ném ENOENT.
    await node_fs_1.promises.mkdir(node_path_1.default.dirname(file), { recursive: true });
    await node_fs_1.promises.writeFile(file, JSON.stringify(vault), 'utf8');
}
function registerSecureStore() {
    electron_1.ipcMain.handle(channels_cjs_1.CHANNELS.secureStoreAvailable, () => electron_1.safeStorage.isEncryptionAvailable());
    electron_1.ipcMain.handle(channels_cjs_1.CHANNELS.secureStoreGet, async (_event, key) => {
        if (typeof key !== 'string' || !electron_1.safeStorage.isEncryptionAvailable())
            return null;
        const vault = await load();
        const encrypted = vault[key];
        if (!encrypted)
            return null;
        try {
            return electron_1.safeStorage.decryptString(Buffer.from(encrypted, 'base64'));
        }
        catch {
            // Đổi máy / đổi user OS -> không giải mã được. Bỏ giá trị hỏng đi.
            delete vault[key];
            await persist(vault);
            return null;
        }
    });
    electron_1.ipcMain.handle(channels_cjs_1.CHANNELS.secureStoreSet, async (_event, key, value) => {
        if (typeof key !== 'string' || typeof value !== 'string')
            return false;
        if (!electron_1.safeStorage.isEncryptionAvailable())
            return false;
        const vault = await load();
        vault[key] = electron_1.safeStorage.encryptString(value).toString('base64');
        await persist(vault);
        return true;
    });
    electron_1.ipcMain.handle(channels_cjs_1.CHANNELS.secureStoreDelete, async (_event, key) => {
        if (typeof key !== 'string')
            return;
        const vault = await load();
        delete vault[key];
        await persist(vault);
    });
}
//# sourceMappingURL=secureStore.ipc.cjs.map