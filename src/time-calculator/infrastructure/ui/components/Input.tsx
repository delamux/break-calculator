interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onInput={(e) => onChange((e.target as HTMLInputElement).value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`input-base ${className}`}
    />
  );
}
