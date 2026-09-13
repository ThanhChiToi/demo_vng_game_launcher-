import { useActionState } from 'react';
import { isAxiosError } from 'axios';
import { Button } from '@/shared/ui';
import { login as loginRequest } from '../../api/auth.api';
import { useAuth } from '../../model/auth.context';
import styles from './LoginForm.module.css';

interface LoginFormState {
  /** Giữ lại username để form không bị xoá trắng sau khi submit thất bại. */
  username: string;
  error: string | null;
}

const initialState: LoginFormState = { username: '', error: null };

function toErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (!error.response) {
      return 'Không kết nối được tới máy chủ. Kiểm tra backend .NET đã chạy chưa.';
    }
  }
  return 'Tài khoản hoặc mật khẩu không chính xác!';
}

export function LoginForm() {
  const { login } = useAuth();

  // useActionState (React 19) gom cả pending state lẫn kết quả của form vào một chỗ.
  // Thay cho bộ ba useState isLoading / errorMessage / handleSubmit của React 18.
  const [state, formAction, isPending] = useActionState<LoginFormState, FormData>(
    async (_previous, formData) => {
      const username = String(formData.get('username') ?? '');
      const password = String(formData.get('password') ?? '');

      try {
        await login(await loginRequest({ username, password }));
        return { username, error: null };
      } catch (error) {
        return { username, error: toErrorMessage(error) };
      }
    },
    initialState,
  );

  return (
    <div className={styles.container}>
      {/* action={} thay cho onSubmit + e.preventDefault() */}
      <form action={formAction} className={styles.form}>
        <h2 className={styles.title}>VNGGames Launcher</h2>
        <p className={styles.subtitle}>Đăng nhập để trải nghiệm kho trò chơi</p>

        {state.error && <div className={styles.errorBox}>{state.error}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Tên tài khoản / Email
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={state.username}
            required
            autoComplete="username"
            placeholder="Nhập tên tài khoản..."
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Nhập mật khẩu..."
            className={styles.input}
          />
        </div>

        <Button type="submit" fullWidth disabled={isPending} className={styles.submit}>
          {isPending ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
        </Button>
      </form>
    </div>
  );
}
