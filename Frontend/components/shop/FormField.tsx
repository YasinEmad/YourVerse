export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "password";
  autoComplete?: string;
  placeholder?: string;
}

export function FormField({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-world-text-muted">{label}</span>
      <input
        className={`rounded-world border border-world-border bg-world-surface px-3 py-2 text-base text-world-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-world-primary${
          error ? " border-world-accent" : ""
        }`}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="text-xs text-world-accent">{error}</span> : null}
    </label>
  );
}
