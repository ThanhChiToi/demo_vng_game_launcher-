import { useSyncExternalStore } from 'react';
import { windowApi } from '@/core/electron/windowApi';
import { windowStateStore } from '@/core/electron/windowStateStore';
import styles from './TitleBar.module.css';

export function TitleBar() {
  // Trạng thái phóng to do main process nắm, nằm ngoài React -> đúng chỗ dùng
  // useSyncExternalStore thay vì useState + useEffect.
  const isMaximized = useSyncExternalStore(
    windowStateStore.subscribe,
    windowStateStore.getSnapshot,
  );

  return (
    <div className={styles.titleBar}>
      <div className={styles.dragArea}>
        <span className={styles.appTitle}>VNGGames Launcher</span>
      </div>

      <div className={styles.windowControls}>
        <button
          type="button"
          onClick={windowApi.minimize}
          aria-label="Thu nhỏ"
          className={styles.controlBtn}
        >
          ─
        </button>
        <button
          type="button"
          onClick={windowApi.maximizeToggle}
          aria-label={isMaximized ? 'Khôi phục kích thước' : 'Phóng to'}
          className={styles.controlBtn}
        >
          {isMaximized ? '❐' : '☐'}
        </button>
        <button
          type="button"
          onClick={windowApi.close}
          aria-label="Đóng"
          className={`${styles.controlBtn} ${styles.closeBtn}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
