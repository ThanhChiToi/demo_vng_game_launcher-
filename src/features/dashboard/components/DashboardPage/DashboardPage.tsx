import { Button } from '@/shared/ui';
import { useAuth } from '@/features/auth';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>VNGGames Dashboard</h1>
      <p className={styles.greeting}>
        Xin chào, <strong>{user?.username}</strong>!
      </p>
      <Button variant="danger" onClick={() => void logout()}>
        Đăng xuất
      </Button>
    </div>
  );
}
