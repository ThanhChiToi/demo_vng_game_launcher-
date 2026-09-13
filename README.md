# VNGGames Launcher

Game launcher desktop dựng bằng **Electron 44 + React 19 + TypeScript 6 + Vite 8**.
Backend dự kiến: **.NET Core Web API** (mặc định `https://localhost:7123/api`).

## Chạy dự án

```bash
npm install
cp .env.example .env     # chỉnh VITE_API_URL nếu backend đổi port
npm run electron:dev
```

| Script | Việc nó làm |
| --- | --- |
| `npm run dev` | Chỉ chạy Vite dev server (mở bằng trình duyệt, không có Electron) |
| `npm run electron:dev` | Build main/preload rồi chạy Electron trỏ vào dev server |
| `npm run build:main` | Biên dịch riêng main process (`.cts` → `.cjs`) |
| `npm run build` | Typecheck toàn bộ (`src`, `electron`, `vite.config.ts`) rồi build renderer |
| `npm run electron:build` | Đóng gói app bằng electron-builder |
| `npm run lint` | ESLint, gồm cả rule kiểm tra ranh giới kiến trúc |

Đổi port dev server: đặt `VITE_DEV_SERVER_URL=http://localhost:5174` khi chạy Electron.

## Cấu trúc

> 📘 Xem [ARCHITECTURE.md](ARCHITECTURE.md) để biết chi tiết đặt file ở đâu, quy ước đặt tên,
> và công thức từng bước khi thêm component / feature / route / kênh IPC.

Chia theo **feature**, không chia theo loại file. Tương ứng 1-1 với cách Angular
hiện đại tổ chức `core / shared / features`:

```
electron/                      Main process (Node). Nguồn .cts -> tsc emit thẳng .cjs
  main.cts                     Vòng đời app, single-instance lock
  window.cts                   Tạo BrowserWindow (frame: false, sandbox: true)
  security.cts                 Bỏ qua cert self-signed của localhost KHI DEV
  preload.cts                  contextBridge — chạy trong sandbox, xem cảnh báo bên dưới
  ipc/
    channels.cts               Tên kênh IPC (nguồn chân lý)
    windowControls.ipc.cts     minimize / maximize / close
    secureStore.ipc.cts        Kho key/value mã hoá bằng safeStorage
  shared/electronApi.d.ts      Hợp đồng type, chỉ có type nên cả hai phía đọc được

src/
  main.tsx                     Bootstrap                      ≈ main.ts
  index.css                    Design token toàn cục          ≈ styles.css
  app/                         Shell                          ≈ AppComponent
    App.tsx                    RouterProvider
    router.tsx                 createHashRouter
    providers/AppProviders.tsx Gom provider cấp app           ≈ app.config.ts
    layout/AppLayout.tsx       TitleBar + <Outlet/>
    layout/TitleBar/
    routes/RequireAuth.tsx     Guard route                    ≈ canActivate
    routes/LoginRoute.tsx
  core/                        Hạ tầng singleton              ≈ core/
    config/env.ts              Biến môi trường                ≈ environment.ts
    api/                       axios + interceptor            ≈ HttpClient + HttpInterceptorFn
    storage/authStorage.ts     safeStorage, fallback localStorage
    electron/                  Bọc API preload + store trạng thái cửa sổ
  shared/ui/                   Button, Splash                 ≈ shared/
  features/
    auth/                      api / model / components + index.ts (public API)
    dashboard/
```

### Quy tắc phụ thuộc

```
app  ──>  features  ──>  shared, core
```

- Một chiều: `core` và `shared` **không được** import ngược lên `features` hay `app`.
- Feature này gọi feature kia **chỉ qua barrel** (`@/features/auth`), không chọc vào thư mục con.

React không có `NgModule` để chặn import bậy, nên hai quy tắc trên được ép bằng
`no-restricted-imports` trong [`eslint.config.js`](eslint.config.js) — vi phạm là lint đỏ.

Alias `@/*` trỏ tới `src/*`. Riêng `#electron/*` **chỉ dùng cho `import type`** —
Vite không biết alias này, nên import giá trị qua nó sẽ vỡ lúc build.

## ⚠️ Preload chạy trong sandbox

Từ Electron 20, preload chạy sandbox và **không `require()` được file cục bộ**
(chỉ `electron` và vài built-in). Nếu preload import một file trong project,
nó sẽ im lặng thất bại và `window.electronAPI` thành `undefined`.

Vì vậy `preload.cts` phải **tự chứa mọi thứ**. Tên kênh IPC được viết lại nguyên văn
trong đó, nhưng ràng buộc kiểu về `channels.cts` bằng `typeof import(...)` — vốn bị
xoá sạch lúc biên dịch — nên gõ sai một ký tự là lỗi compile ngay.

Khi nào chuyển sang bundler (electron-vite / vite-plugin-electron) thì hạn chế này biến mất.

## Ghi chú cho người đến từ Angular

| Angular hiện đại | Ở đây |
| --- | --- |
| `signal()` | `useState` |
| `effect()` | `useEffect` |
| `inject(AuthService)` | `useAuth()` |
| `HttpInterceptorFn` | `core/api/auth.interceptor.ts` |
| `canActivate` guard | `app/routes/RequireAuth.tsx` |
| Reactive Forms + trạng thái submit | `useActionState` |
| `providers: [...]` trong `app.config.ts` | `app/providers/AppProviders.tsx` |

Hai chỗ dễ nhầm:

- `useEffect(..., [])` **không phải** `ngOnInit`. Dưới `StrictMode` nó chạy 2 lần ở dev.
- Context **không phải** DI. Mọi component dùng `useAuth()` sẽ re-render khi context đổi,
  nên chỉ để dữ liệu ít thay đổi ở đó, đừng để game list hay tiến độ download.

Trạng thái nằm **ngoài** React (ví dụ cửa sổ đang phóng to hay không, do main process nắm)
thì dùng `useSyncExternalStore` — xem `core/electron/windowStateStore.ts`.

## Việc còn lại

Cần backend .NET chạy trước:

- [ ] Response interceptor bắt 401 → gọi `/auth/refresh` (refreshToken đang lưu mà chưa dùng)
- [ ] TanStack Query cho server state (game list, tiến độ download)
- [ ] Sinh type từ Swagger của .NET thay vì viết tay `auth.types.ts`

Không cần backend:

- [ ] Chuyển sang bundler cho main/preload — `electron-vite@6` khi lên stable
      (bản 5 chỉ hỗ trợ tới Vite 7), hoặc `vite-plugin-electron`
- [ ] Auto-update (electron-updater)
- [ ] Feature `library`: danh sách game, download có tiến độ, cài đặt, chạy game
