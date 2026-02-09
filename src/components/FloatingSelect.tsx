import { useState, useId, forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface FloatingSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const FloatingSelect = forwardRef<HTMLSelectElement, FloatingSelectProps>(
  ({ 
    label, 
    error, 
    helperText, 
    options,
    className,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState(props.value || '');
    const id = useId();
    
    const hasValue = value !== '';
    const isFloating = isFocused || hasValue;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        <div className="relative">
          <select
            ref={ref}
            id={id}
            {...props}
            value={value}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "peer w-full px-4 pt-6 pb-2 rounded-lg border-2 bg-white transition-all duration-200 outline-none appearance-none cursor-pointer",
              isFocused && !error && "border-blue-500 ring-4 ring-blue-500/10",
              !isFocused && !error && "border-gray-300 hover:border-gray-400",
              error && "border-red-500 ring-4 ring-red-500/10",
              props.disabled && "bg-gray-50 cursor-not-allowed opacity-60",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
          >
            <option value=""></option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Dropdown icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg 
              className={cn(
                "w-5 h-5 transition-colors",
                isFocused && !error && "text-blue-600",
                !isFocused && !error && "text-gray-600",
                error && "text-red-600"
              )}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <label
            htmlFor={id}
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none origin-left",
              isFloating
                ? "top-2 text-xs font-medium"
                : "top-1/2 -translate-y-1/2 text-base",
              isFocused && !error && "text-blue-600",
              !isFocused && !error && "text-gray-600",
              error && "text-red-600",
              props.disabled && "text-gray-400"
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        
        <div className="mt-1 min-h-[20px]">
          {error && (
            <p id={`${id}-error`} className="text-sm text-red-600 flex items-center gap-1" role="alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          {!error && helperText && (
            <p id={`${id}-helper`} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FloatingSelect.displayName = 'FloatingSelect';
