import { Outlet } from 'react-router-dom';
import { TitleBar } from '../TitleBar/TitleBar';
import styles from './AppLayout.module.css';

/** Khung chung của mọi màn hình: thanh title cố định trên cùng + nội dung bên dưới. */
export function AppLayout() {
  return (
    <div className={styles.shell}>
      {/* Thanh title tự vẽ vì BrowserWindow dùng frame: false */}
      <TitleBar />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
