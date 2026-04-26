import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
}

type FormInputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;

type FormSelectProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: { label: string; value: string }[];
  };

type FormTextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

const fieldClass =
  "mt-2 w-full rounded-md border border-factory-line bg-white px-4 py-3 text-base text-factory-ink outline-none focus:border-factory-green focus:ring-2 focus:ring-green-100";

export function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <label className="block text-sm font-semibold text-factory-ink">
      {label}
      <input className={fieldClass} {...props} />
      {error ? <span className="mt-1 block text-sm text-factory-red">{error}</span> : null}
    </label>
  );
}

export function FormSelect({ label, error, options, ...props }: FormSelectProps) {
  return (
    <label className="block text-sm font-semibold text-factory-ink">
      {label}
      <select className={fieldClass} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-sm text-factory-red">{error}</span> : null}
    </label>
  );
}

export function FormTextarea({ label, error, ...props }: FormTextareaProps) {
  return (
    <label className="block text-sm font-semibold text-factory-ink">
      {label}
      <textarea className={`${fieldClass} min-h-28`} {...props} />
      {error ? <span className="mt-1 block text-sm text-factory-red">{error}</span> : null}
    </label>
  );
}
