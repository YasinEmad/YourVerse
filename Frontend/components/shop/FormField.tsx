export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
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
    <label className="shop-field">
      <span className="shop-field__label">{label}</span>
      <input
        className={`shop-field__input${error ? " has-error" : ""}`}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="shop-field__error">{error}</span> : null}
    </label>
  );
}
