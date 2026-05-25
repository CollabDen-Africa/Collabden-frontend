import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "light" | "glass";
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      variant = "glass",
      containerClassName = "",
      className = "",
      id,
      children,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const baseStyles =
      "w-full px-4 py-3 rounded-full outline-none font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      // Light background inputs (e.g. login/signup)
      light:
        "bg-white text-text-main border border-border-muted placeholder:text-text-muted focus:border-primary-green focus:ring-4 focus:ring-primary-green/10",
      // Glassmorphic dark background inputs (e.g. project setup, dashboard)
      glass:
        "bg-white/10 text-white border-2 border-transparent placeholder:text-white/50 hover:border-primary-green focus:border-primary-green focus:bg-white/15",
    };

    return (
      <div className={`space-y-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-semibold block pl-1 ${
              variant === "glass" ? "text-white" : "text-text-main"
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${
              error
                ? variant === "glass"
                  ? "border-red-400 focus:border-red-400"
                  : "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : ""
            } ${className}`}
            {...props}
          />
          {children}
        </div>
        {error && (
          <p className={`text-xs font-medium pl-3 mt-1 ${variant === "glass" ? "text-red-400" : "text-red-500"}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
