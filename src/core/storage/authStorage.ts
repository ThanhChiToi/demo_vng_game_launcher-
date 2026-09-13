import { getSecureStore } from '@/core/electron/windowApi';

/**
 * Nơi duy nhất đụng tới chỗ lưu phiên đăng nhập.
 *
 * Ưu tiên safeStorage của Electron (mã hoá bằng credential store của OS).
 * Rơi về localStorage khi: chạy `npm run dev` trong trình duyệt thuần, hoặc OS
 * không cung cấp được credential store (một số bản Linux).
 *
 * Toàn bộ API ở đây là async vì IPC là async. Riêng access token có thêm bản
 * cache đồng bộ để interceptor của axios không phải await mỗi request.
 */

const KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  user: 'user_info',
} as const;

export interface StoredSession<TUser> {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}

interface StorageAdapter {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

const localStorageAdapter: StorageAdapter = {
  get: (key) => Promise.resolve(safeLocalStorage(() => localStorage.getItem(key), null)),
  set: (key, value) => {
    safeLocalStorage(() => localStorage.setItem(key, value), undefined);
    return Promise.resolve();
  },
  remove: (key) => {
    safeLocalStorage(() => localStorage.removeItem(key), undefined);
    return Promise.resolve();
  },
};

function safeLocalStorage<T>(action: () => T, fallback: T): T {
  try {
    return action();
  } catch {
    // Storage bị chặn hoặc hết quota.
    return fallback;
  }
}

let adapterPromise: Promise<StorageAdapter> | null = null;

async function resolveAdapter(): Promise<StorageAdapter> {
  const secureStore = getSecureStore();
  if (secureStore && (await secureStore.isAvailable())) {
    return {
      get: (key) => secureStore.get(key),
      set: async (key, value) => {
        await secureStore.set(key, value);
      },
      remove: (key) => secureStore.delete(key),
    };
  }
  return localStorageAdapter;
}

function getAdapter(): Promise<StorageAdapter> {
  adapterPromise ??= resolveAdapter();
  return adapterPromise;
}

/** Bản sao đồng bộ của access token, để interceptor đọc mà không cần await. */
let cachedAccessToken: string | null = null;

export const getCachedAccessToken = (): string | null => cachedAccessToken;

export const authStorage = {
  async read<TUser>(): Promise<StoredSession<TUser> | null> {
    const adapter = await getAdapter();
    const [accessToken, refreshToken, rawUser] = await Promise.all([
      adapter.get(KEYS.accessToken),
      adapter.get(KEYS.refreshToken),
      adapter.get(KEYS.user),
    ]);

    if (!accessToken || !rawUser) return null;

    let user: TUser;
    try {
      user = JSON.parse(rawUser) as TUser;
    } catch {
      // Dữ liệu hỏng thì coi như chưa đăng nhập, đừng để app crash trắng màn hình.
      await authStorage.clear();
      return null;
    }

    cachedAccessToken = accessToken;
    return { accessToken, refreshToken: refreshToken ?? '', user };
  },

  async save<TUser>(session: StoredSession<TUser>): Promise<void> {
    const adapter = await getAdapter();
    cachedAccessToken = session.accessToken;
    await Promise.all([
      adapter.set(KEYS.accessToken, session.accessToken),
      adapter.set(KEYS.refreshToken, session.refreshToken),
      adapter.set(KEYS.user, JSON.stringify(session.user)),
    ]);
  },

  async clear(): Promise<void> {
    const adapter = await getAdapter();
    cachedAccessToken = null;
    await Promise.all(Object.values(KEYS).map((key) => adapter.remove(key)));
  },
};
