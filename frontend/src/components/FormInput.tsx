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
  "mt-2 w-full rounded-xl border border-factory-line bg-white px-4 py-3 text-base text-factory-ink transition-all outline-none focus:border-factory-green focus:ring-4 focus:ring-factory-green/5 placeholder:text-slate-400";

export function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 ml-1">{label}</span>
      <input className={fieldClass} {...props} />
      {error ? <span className="mt-1 block text-sm font-medium text-factory-red ml-1">{error}</span> : null}
    </label>
  );
}

export function FormSelect({ label, error, options, ...props }: FormSelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 ml-1">{label}</span>
      <select className={fieldClass} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-sm font-medium text-factory-red ml-1">{error}</span> : null}
    </label>
  );
}

export function FormTextarea({ label, error, ...props }: FormTextareaProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 ml-1">{label}</span>
      <textarea className={`${fieldClass} min-h-28`} {...props} />
      {error ? <span className="mt-1 block text-sm font-medium text-factory-red ml-1">{error}</span> : null}
    </label>
  );
}
