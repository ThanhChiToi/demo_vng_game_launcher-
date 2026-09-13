import { app, ipcMain, safeStorage } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { CHANNELS } from './channels.cjs';

/**
 * Kho key/value được mã hoá bằng safeStorage (dùng credential store của hệ điều hành).
 *
 * Cố ý thiết kế TRUNG LẬP: nó chỉ biết get/set/delete theo key, không hề biết
 * "access token" hay "refresh token" là gì. Nhờ vậy dù backend sau này chọn JWT,
 * httpOnly cookie hay OAuth2/PKCE thì phần Electron này cũng không phải sửa —
 * chỉ tầng renderer đổi cách dùng.
 */

/** key -> ciphertext dạng base64 */
type Vault = Record<string, string>;

let cache: Vault | null = null;

const vaultPath = (): string => path.join(app.getPath('userData'), 'secure-store.json');

async function load(): Promise<Vault> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(vaultPath(), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    cache = typeof parsed === 'object' && parsed !== null ? (parsed as Vault) : {};
  } catch {
    // Chưa có file, hoặc file hỏng -> coi như kho rỗng.
    cache = {};
  }
  return cache;
}

async function persist(vault: Vault): Promise<void> {
  cache = vault;
  const file = vaultPath();
  // Electron thường tạo sẵn userData, nhưng nếu chưa có thì writeFile sẽ ném ENOENT.
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(vault), 'utf8');
}

export function registerSecureStore(): void {
  ipcMain.handle(CHANNELS.secureStoreAvailable, () => safeStorage.isEncryptionAvailable());

  ipcMain.handle(CHANNELS.secureStoreGet, async (_event, key: unknown): Promise<string | null> => {
    if (typeof key !== 'string' || !safeStorage.isEncryptionAvailable()) return null;

    const vault = await load();
    const encrypted = vault[key];
    if (!encrypted) return null;

    try {
      return safeStorage.decryptString(Buffer.from(encrypted, 'base64'));
    } catch {
      // Đổi máy / đổi user OS -> không giải mã được. Bỏ giá trị hỏng đi.
      delete vault[key];
      await persist(vault);
      return null;
    }
  });

  ipcMain.handle(
    CHANNELS.secureStoreSet,
    async (_event, key: unknown, value: unknown): Promise<boolean> => {
      if (typeof key !== 'string' || typeof value !== 'string') return false;
      if (!safeStorage.isEncryptionAvailable()) return false;

      const vault = await load();
      vault[key] = safeStorage.encryptString(value).toString('base64');
      await persist(vault);
      return true;
    },
  );

  ipcMain.handle(CHANNELS.secureStoreDelete, async (_event, key: unknown): Promise<void> => {
    if (typeof key !== 'string') return;
    const vault = await load();
    delete vault[key];
    await persist(vault);
  });
}
