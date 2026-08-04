import React from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorMessage,
  icon,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-right">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold text-txt-primary flex items-center justify-between">
          <span>{label}</span>
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute right-3 text-txt-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          disabled={disabled}
          className={`w-full bg-surface text-txt-primary placeholder:text-txt-muted/60 text-sm font-medium rounded-itqan-input border border-bdr px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:bg-surface-secondary ${
            icon ? 'pr-10' : ''
          } ${errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-bold text-red-500">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-[11px] text-txt-muted">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  errorMessage,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-right">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold text-txt-primary">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        disabled={disabled}
        className={`w-full bg-surface text-txt-primary placeholder:text-txt-muted/60 text-sm font-medium rounded-itqan-input border border-bdr p-3 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 min-h-[100px] resize-y ${
          errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
        } ${className}`}
        {...props}
      />
      {errorMessage ? (
        <p className="text-[11px] font-bold text-red-500">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-[11px] text-txt-muted">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  errorMessage,
  options,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-right">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold text-txt-primary">
          {label}
        </label>
      )}
      <select
        id={inputId}
        disabled={disabled}
        className={`w-full bg-surface text-txt-primary text-sm font-medium rounded-itqan-input border border-bdr px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 cursor-pointer ${
          errorMessage ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-txt-primary">
            {opt.label}
          </option>
        ))}
      </select>
      {errorMessage ? (
        <p className="text-[11px] font-bold text-red-500">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-[11px] text-txt-muted">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled }) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
          checked ? 'bg-orange-500' : 'bg-surface-secondary border border-bdr'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition duration-200 ease-in-out ${
            checked ? '-translate-x-5' : '-translate-x-1'
          }`}
        />
      </button>
      {label && <span className="text-xs font-bold text-txt-primary">{label}</span>}
    </label>
  );
};
