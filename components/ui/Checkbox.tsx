import React, { forwardRef } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  containerClassName?: string;
}

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      checked,
      onChange,
      label,
      error,
      disabled = false,
      containerClassName = "",
    },
    ref
  ) => {
    return (
      <div className={`space-y-1.5 ${containerClassName}`} ref={ref}>
        <div
          className={`flex items-start gap-3 cursor-pointer group select-none ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={() => !disabled && onChange(!checked)}
        >
          {/* Animated Circle Checkbox Container */}
          <div
            className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
              checked
                ? "bg-primary-green border-primary-green shadow-circle-check"
                : "border-border-muted group-hover:border-primary-green"
            }`}
          >
            {checked && (
              <div className="h-2 w-2 rounded-full bg-white transition-all scale-100" />
            )}
          </div>
          {label && (
            <span className="text-sm text-gray-500 leading-tight">
              {label}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium pl-3 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
