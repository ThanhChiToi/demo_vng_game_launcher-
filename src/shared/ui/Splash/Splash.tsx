import styles from './Splash.module.css';

export function Splash({ message }: { message?: string }) {
  return (
    <div className={styles.splash}>
      <div className={styles.spinner} />
      {message && <span>{message}</span>}
    </div>
  );
}
