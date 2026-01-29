import type { JSX } from 'preact';

interface ButtonProps {
  onClick?: () => void;
  children: JSX.Element | string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export function Button({
  onClick,
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
}: ButtonProps) {
  const variantClass = variant === 'primary' ? 'btn-primary' : 
                       variant === 'secondary' ? 'btn-secondary' :
                       variant === 'destructive' ? 'btn-destructive' :
                       'btn-ghost';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
