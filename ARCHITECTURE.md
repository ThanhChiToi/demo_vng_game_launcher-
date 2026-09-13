# Cấu trúc dự án — sổ tay tra cứu

Tài liệu này trả lời đúng một câu hỏi: **"file mới của tôi đặt ở đâu, đặt tên thế nào?"**

Xem [README.md](README.md) cho phần chạy dự án và scripts.

---

## 1. Ba môi trường JavaScript

App Electron không phải một chương trình mà là **ba** chương trình chạy song song,
mỗi cái có quyền hạn khác nhau. Biết mình đang viết cho môi trường nào là việc đầu tiên.

| Môi trường | Chạy ở đâu | Quyền | Thư mục |
| --- | --- | --- | --- |
| **Main** | Node.js | Toàn quyền: file, OS, mạng, cửa sổ | `electron/` (trừ `preload.cts`) |
| **Preload** | Cầu nối, **bị sandbox** | Rất hạn chế, xem §7 | `electron/preload.cts` |
| **Renderer** | Chromium | Như một trang web bình thường | `src/` |

Renderer **không** gọi được Node API. Muốn đụng tới file/OS thì phải đi qua IPC — xem công thức §6.6.

---

## 2. Cây thư mục đầy đủ

```
electron/                          ── MAIN PROCESS (Node) ──
  main.cts                         Điểm vào. Single-instance lock, vòng đời app
  window.cts                       Tạo BrowserWindow, nạp renderer
  security.cts                     Bỏ qua cert self-signed của localhost KHI DEV
  preload.cts                      contextBridge. CHẠY TRONG SANDBOX — đọc §7
  ipc/
    channels.cts                   Tên kênh IPC — nguồn chân lý duy nhất
    windowControls.ipc.cts         Handler: minimize / maximize / close
    secureStore.ipc.cts            Handler: kho key/value mã hoá bằng safeStorage
  shared/
    electronApi.d.ts               Hợp đồng type. CHỈ có type, không có runtime

src/                               ── RENDERER (React) ──
  main.tsx                         Bootstrap React            ≈ main.ts (Angular)
  index.css                        Design token toàn cục      ≈ styles.css
  vite-env.d.ts                    Khai báo biến môi trường

  app/                             ── TẦNG SHELL ──           ≈ AppComponent
    App.tsx                        Chỉ render <RouterProvider>
    router.tsx                     Khai báo toàn bộ route
    providers/
      AppProviders.tsx             Gom provider cấp app       ≈ app.config.ts
    layout/
      AppLayout/                   Khung chung: TitleBar + <Outlet/>
      TitleBar/                    Thanh title tự vẽ
    routes/
      RequireAuth.tsx              Guard route                ≈ canActivate
      LoginRoute.tsx               Đã đăng nhập thì đá về "/"

  core/                            ── HẠ TẦNG ──              ≈ core/
    config/env.ts                  Biến môi trường            ≈ environment.ts
    api/
      httpClient.ts                Instance axios dùng chung  ≈ HttpClient
      auth.interceptor.ts          Gắn Bearer token           ≈ HttpInterceptorFn
    storage/authStorage.ts         Lưu phiên: safeStorage, fallback localStorage
    electron/
      windowApi.ts                 Bọc window.electronAPI cho an toàn
      windowStateStore.ts          Store ngoài React cho trạng thái cửa sổ

  shared/                          ── DÙNG CHUNG ──           ≈ shared/
    ui/
      index.ts                     Barrel: export mọi UI component
      Button/
      Splash/

  features/                        ── NGHIỆP VỤ ──
    auth/
      index.ts                     PUBLIC API của feature     ≈ public-api.ts
      api/auth.api.ts              Gọi endpoint
      model/
        auth.types.ts              Interface / DTO
        auth.context.ts            createContext + hook useAuth
        AuthProvider.tsx           Provider
      components/
        LoginForm/
    library/                     Kho game
      index.ts
      model/game.types.ts
      components/
        DashboardPage/           Màn hình chính: hero banner + lưới game
        GameCard/                Chi tiết nội bộ, KHÔNG export ra index.ts
```

---

## 3. Tôi muốn thêm... thì đặt ở đâu?

| Thứ cần thêm | Đặt ở | Ví dụ có sẵn |
| --- | --- | --- |
| Nút bấm, input, modal... dùng ở nhiều feature | `src/shared/ui/<Ten>/` | `shared/ui/Button/` |
| Màn hình mới (download, settings...) | `src/features/<ten>/` | `features/library/` |
| Component chỉ dùng trong 1 feature | `src/features/<ten>/components/<Ten>/` | `features/library/components/GameCard/` |
| Hàm gọi API | `src/features/<ten>/api/<ten>.api.ts` | `features/auth/api/auth.api.ts` |
| Interface / DTO | `src/features/<ten>/model/<ten>.types.ts` | `features/auth/model/auth.types.ts` |
| Custom hook của 1 feature | `src/features/<ten>/model/use<Ten>.ts` | (chưa có) |
| Route mới | `src/app/router.tsx` | — |
| Guard route | `src/app/routes/` | `routes/RequireAuth.tsx` |
| Provider cấp app | `src/app/providers/AppProviders.tsx` | — |
| Biến môi trường | `src/core/config/env.ts` + `.env.example` | — |
| Interceptor axios | `src/core/api/` | `core/api/auth.interceptor.ts` |
| Đụng tới file / OS / cửa sổ | `electron/ipc/<ten>.ipc.cts` + preload + `core/electron/` | `ipc/secureStore.ipc.cts` |
| Hằng số dùng chung | cạnh nơi dùng; dùng nhiều nơi thì `src/shared/` | — |

**Khi nào tạo feature mới thay vì thêm vào feature cũ?**
Khi nó có màn hình riêng và dữ liệu riêng. `library` (kho game), `download`, `settings`
là feature riêng. Một dialog con của màn hình game thì nằm trong `features/library/`.

---

## 4. Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
| --- | --- | --- |
| Thư mục component | `PascalCase` | `LoginForm/` |
| File component | `PascalCase.tsx` | `LoginForm.tsx` |
| CSS Module | `<TenComponent>.module.css` | `LoginForm.module.css` |
| Thư mục feature / tầng | `camelCase` | `auth/`, `core/api/` |
| File type | `<ten>.types.ts` | `auth.types.ts` |
| File API | `<ten>.api.ts` | `auth.api.ts` |
| IPC handler | `<ten>.ipc.cts` | `secureStore.ipc.cts` |
| Hook | `use<Ten>.ts` | `useAuth` |
| Barrel | `index.ts` | `features/auth/index.ts` |

**Quy tắc thư mục riêng:** component có file đi kèm (CSS, test, sub-component)
thì nằm trong thư mục cùng tên. Component đơn lẻ một file thì để phẳng.

```
LoginForm/                    ✅ có CSS riêng
  LoginForm.tsx
  LoginForm.module.css

routes/RequireAuth.tsx        ✅ không có file kèm, để phẳng
GameCard/GameCard.tsx         ✅ style bằng Tailwind, không có file CSS
```

---

## 4.5 Styling — Tailwind hay CSS Modules?

Dự án dùng **Tailwind v4** (qua `@tailwindcss/vite`), đồng thời vẫn còn một số
component viết bằng **CSS Modules**. Hai hệ này sống chung được vì **design token
khai chung một chỗ**.

```css
/* src/index.css */
@theme {
  --color-brand: #ff5722;   /* cam VNG */
  --color-surface: #1e1e1e;
}
```

Khai trong `@theme` thì Tailwind sinh ra **cả hai**:

| Cách dùng | Ví dụ |
| --- | --- |
| Utility class | `className="bg-brand text-surface"` |
| Biến CSS | `background-color: var(--color-brand);` |

Nhờ vậy `Button`, `LoginForm`, `TitleBar`, `Splash` (CSS Modules) và các component
mới viết bằng Tailwind vẫn ra đúng một bảng màu.

**Chọn cái nào cho component mới?**

- **Tailwind** cho phần lớn trường hợp — nhanh, không phải nghĩ tên class.
- **CSS Modules** khi cần `@keyframes`, selector phức tạp, hoặc style quá dài
  làm JSX rối mắt (xem `Splash.module.css`).

**Luôn dùng token, đừng hardcode.** Viết `bg-brand` chứ đừng `bg-[#ff5722]`;
viết `var(--color-surface)` chứ đừng `#1e1e1e`. Đổi màu thương hiệu thì chỉ sửa
một chỗ trong `index.css`.

---

## 5. Quy tắc phụ thuộc (QUAN TRỌNG)

```
app  ────>  features  ────>  shared, core
```

Mũi tên đi **một chiều**. Cụ thể:

| Từ | Được import | Không được import |
| --- | --- | --- |
| `app/` | mọi thứ | — |
| `features/` | `shared/`, `core/`, feature khác **qua barrel** | `app/`, ruột feature khác |
| `shared/`, `core/` | `shared/`, `core/` | `app/`, `features/` |

```ts
// ✅ ĐÚNG — qua public API của feature
import { useAuth } from '@/features/auth';

// ❌ SAI — chọc thẳng vào ruột feature khác, lint sẽ đỏ
import { useAuth } from '@/features/auth/model/auth.context';

// ❌ SAI — core không được biết tới features (trong file src/core/...)
import type { User } from '@/features/auth';
```

React không có `NgModule` để chặn, nên hai quy tắc này được **ép bằng ESLint**
(`no-restricted-imports` trong [eslint.config.js](eslint.config.js)). Vi phạm là `npm run lint` báo đỏ.

**Hệ quả:** khi tạo feature mới, **bắt buộc** phải có `index.ts` làm public API,
nếu không feature khác không gọi được gì cả.

### Alias

| Alias | Trỏ tới | Lưu ý |
| --- | --- | --- |
| `@/*` | `src/*` | Dùng bình thường |
| `#electron/*` | `electron/*` | **CHỈ dùng cho `import type`** |

`#electron/*` chỉ khai trong `tsconfig.app.json`, Vite không biết nó.
Import một **giá trị** qua alias này sẽ compile được nhưng **vỡ lúc chạy**.

---

## 6. Công thức

### 6.1 Thêm UI component dùng chung

```
src/shared/ui/Card/
  Card.tsx
  Card.module.css
```

```tsx
// Card.tsx
import type { ReactNode } from 'react';
import styles from './Card.module.css';

export function Card({ children }: { children: ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}
```

Rồi thêm vào barrel:

```ts
// src/shared/ui/index.ts
export { Card } from './Card/Card';
```

Hoặc gọn hơn bằng Tailwind, khỏi cần file CSS (xem §4.5 để biết khi nào chọn cái nào):

```tsx
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">{children}</div>
  );
}
```

### 6.2 Thêm feature mới (ví dụ `library` — kho game)

```
src/features/library/
  index.ts
  api/library.api.ts
  model/library.types.ts
  components/GameGrid/
    GameGrid.tsx
    GameGrid.module.css
```

```ts
// model/library.types.ts
export interface Game {
  id: string;
  name: string;
  coverUrl: string;
}
```

```ts
// api/library.api.ts
import { httpClient } from '@/core/api/httpClient';
import type { Game } from '../model/library.types';

export async function fetchGames(): Promise<Game[]> {
  const { data } = await httpClient.get<Game[]>('/games');
  return data;
}
```

```ts
// index.ts — CHỈ export thứ feature khác cần. Giữ càng nhỏ càng tốt.
export { GameGrid } from './components/GameGrid/GameGrid';
export type { Game } from './model/library.types';
```

### 6.3 Thêm route

```tsx
// src/app/router.tsx
import { GameGrid } from '@/features/library';

export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/login', element: <LoginRoute /> },
      {
        element: <RequireAuth />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: '/library', element: <GameGrid /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
```

Mọi route đặt bên trong `<RequireAuth />` đều tự động yêu cầu đăng nhập.

⚠️ Bắt buộc `createHashRouter`, **không** dùng `createBrowserRouter` — bản đóng gói
nạp giao diện qua `file://` nên history API không hoạt động.

Điều hướng trong code: `const navigate = useNavigate(); navigate('/library')`.

### 6.4 Thêm form

Dùng `useActionState` (React 19), đừng tự quản `isLoading` + `error` bằng `useState`.
Xem mẫu đầy đủ ở [LoginForm.tsx](src/features/auth/components/LoginForm/LoginForm.tsx).

```tsx
const [state, formAction, isPending] = useActionState<FormState, FormData>(
  async (_previous, formData) => {
    const name = String(formData.get('name') ?? '');
    try {
      await doSomething(name);
      return { error: null };
    } catch (error) {
      return { error: toErrorMessage(error) };
    }
  },
  { error: null },
);

// không cần onSubmit, không cần e.preventDefault()
return <form action={formAction}>...</form>;
```

### 6.5 Thêm biến môi trường

Ba chỗ, thiếu một là hỏng:

```ts
// 1. src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_CDN_URL?: string;
}
```

```ts
// 2. src/core/config/env.ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'https://localhost:7123/api',
  cdnUrl: import.meta.env.VITE_CDN_URL ?? 'https://cdn.example.com',
} as const;
```

```bash
# 3. .env.example
VITE_CDN_URL=https://cdn.example.com
```

Chỉ đọc qua `env`, **đừng** rải `import.meta.env` khắp code.

### 6.6 Thêm kênh IPC mới (renderer cần đụng file/OS)

Năm bước, đúng thứ tự:

```ts
// ── 1. electron/ipc/channels.cts — khai tên kênh
export const CHANNELS = {
  // ...
  gamesInstallPath: 'games:install-path',
} as const;
```

```ts
// ── 2. electron/ipc/games.ipc.cts — handler chạy trong main process
import { ipcMain, app } from 'electron';
import { CHANNELS } from './channels.cjs';

export function registerGamesIpc(): void {
  ipcMain.handle(CHANNELS.gamesInstallPath, () => app.getPath('userData'));
}
```

```ts
// ── 3. electron/main.cts — gọi register sau khi app ready
void app.whenReady().then(() => {
  registerSecureStore();
  registerGamesIpc();
  createMainWindow();
});
```

```ts
// ── 4a. electron/shared/electronApi.d.ts — thêm vào hợp đồng
export interface ElectronApi {
  // ...
  getInstallPath: () => Promise<string>;
}
```

```ts
// ── 4b. electron/preload.cts — thêm CẢ tên kênh (viết tay!) lẫn hàm
const CHANNELS: ChannelMap = {
  // ...
  gamesInstallPath: 'games:install-path', // gõ sai là lỗi compile
};

const api: ElectronApi = {
  // ...
  getInstallPath: () => ipcRenderer.invoke(CHANNELS.gamesInstallPath) as Promise<string>,
};
```

```ts
// ── 5. src/core/electron/windowApi.ts — bọc lại cho renderer
export const windowApi = {
  // ...
  getInstallPath: async (): Promise<string> =>
    (await window.electronAPI?.getInstallPath()) ?? '',
};
```

Luôn bọc `?.` và có giá trị mặc định: khi chạy `npm run dev` trong trình duyệt
thuần thì `window.electronAPI` là `undefined`.

---

## 7. ⚠️ Bẫy thường gặp

### Preload chạy trong sandbox

Từ Electron 20, preload bị sandbox và **không `require()` được file trong project**
(chỉ `electron` và vài built-in). Nếu lỡ import, nó **thất bại im lặng** —
`window.electronAPI` thành `undefined` mà không có thông báo lỗi nào.

Vì vậy [preload.cts](electron/preload.cts) phải tự chứa mọi thứ. Tên kênh được viết
lại nguyên văn trong đó, nhưng ràng buộc kiểu về `channels.cts` bằng:

```ts
type ChannelMap = (typeof import('./ipc/channels.cjs'))['CHANNELS'];
```

`typeof import(...)` bị xoá sạch lúc biên dịch nên không sinh `require` nào,
mà gõ sai một ký tự vẫn lỗi compile ngay. **Đừng biến nó thành import thật.**

### `useEffect(..., [])` không phải `ngOnInit`

Dưới `StrictMode` nó chạy **2 lần** ở dev. Muốn khởi tạo một lần từ giá trị đồng bộ
thì dùng lazy initializer:

```ts
const [value, setValue] = useState(() => readSomethingSync());
```

Chỉ dùng `useEffect` khi thật sự phải đồng bộ với thứ bên ngoài React (IPC, subscription).

### Context không phải DI

Mọi component gọi `useAuth()` sẽ re-render khi context value đổi. Chỉ để dữ liệu
**ít thay đổi** trong Context. Game list, tiến độ download thì **không** —
dùng TanStack Query (server state) hoặc store riêng.

### State nằm ngoài React

Trạng thái do main process nắm (ví dụ cửa sổ đang phóng to) thì dùng
`useSyncExternalStore`, xem [windowStateStore.ts](src/core/electron/windowStateStore.ts).

### Chỉ `import type` qua `#electron/*`

Vite không biết alias này. Import giá trị qua nó sẽ vỡ lúc chạy.

### Flex item bị ép xẹp dù đã đặt chiều cao

Trong container `flex flex-col`, mọi con đều **co lại được** (`flex-shrink: 1`).
Đặt `h-72` mà nội dung dài hơn màn hình thì nó vẫn bị bóp còn ~100px, rồi
`overflow-hidden` cắt mất chữ bên trong — nhìn như component hỏng.

```tsx
<div className="relative h-72 shrink-0 overflow-hidden">   {/* 👈 shrink-0 */}
```

Quy tắc: phần tử có chiều cao cố định nằm trong `flex-col` thì **luôn thêm `shrink-0`**.

### Đăng nhập giả lập

Chưa có backend .NET thì đặt `VITE_USE_MOCK_AUTH=true` trong `.env` — gõ tài khoản
gì cũng vào được. Logic mock nằm trong `features/auth/api/auth.api.ts`, **không**
comment code trong component (dễ lỡ tay commit). Đổi `.env` thì phải **restart** dev server.

---

## 8. Checklist trước khi commit

```bash
npm run lint
npm run build
```

- [ ] Feature mới đã có `index.ts` chưa?
- [ ] Có import chọc thẳng vào ruột feature khác không?
- [ ] Màu dùng token (`bg-brand` / `var(--color-brand)`) chứ không hardcode `#ff5722`?
- [ ] Phần tử cao cố định trong `flex-col` đã có `shrink-0` chưa?
- [ ] Component mới có lỡ dùng `React.FC` không? (đừng dùng)
- [ ] Thêm kênh IPC thì đã làm đủ cả 5 bước ở §6.6 chưa?
