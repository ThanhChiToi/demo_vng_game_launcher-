import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

// React 19: không cần React.FC, cũng không cần forwardRef — `ref` truyền thẳng như prop.
export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], fullWidth && styles.fullWidth, className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...rest} />;
}
