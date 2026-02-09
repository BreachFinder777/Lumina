import { useState, useId, forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface FloatingTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    maxLength, 
    showCharCount = false,
    className,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState(props.value || '');
    const id = useId();
    
    const hasValue = value !== '';
    const isFloating = isFocused || hasValue;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        <div className="relative">
          <textarea
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
            maxLength={maxLength}
            className={cn(
              "peer w-full px-4 pt-6 pb-2 rounded-lg border-2 bg-white transition-all duration-200 outline-none resize-y min-h-[120px]",
              "placeholder-transparent",
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
          />
          <label
            htmlFor={id}
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none origin-left",
              isFloating
                ? "top-2 text-xs font-medium"
                : "top-6 text-base",
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
        
        <div className="flex justify-between items-start mt-1 min-h-[20px]">
          <div className="flex-1">
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
          
          {showCharCount && maxLength && (
            <p className={cn(
              "text-sm ml-2 tabular-nums",
              String(value).length > maxLength * 0.9 ? "text-orange-600 font-medium" : "text-gray-500"
            )}>
              {String(value).length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';
