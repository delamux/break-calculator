interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange((e.target as HTMLInputElement).value)}
            className="w-4 h-4 text-[hsl(var(--primary))] border-[hsl(var(--input))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
