import React, { useState } from "react";
import { HiOutlineChevronDown, HiCheck } from "react-icons/hi";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | SelectOption[];
  placeholder?: string;
  error?: string;
  variant?: "glass" | "light";
  disabled?: boolean;
  containerClassName?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  error,
  variant = "glass",
  disabled = false,
  containerClassName = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize options array
  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { label: opt, value: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const baseButtonStyles =
    "w-full h-[52px] rounded-full px-6 flex items-center justify-between outline-none transition-all duration-300 border text-left gap-3 overflow-hidden";

  const buttonVariants = {
    light: `bg-white text-text-main border-border-muted placeholder:text-text-muted focus:border-primary-green ${
      isOpen ? "border-primary-green" : "hover:border-primary-green"
    }`,
    glass: `bg-white/20 text-white border-transparent hover:border-primary-green focus:border-primary-green focus:bg-white/15 ${
      isOpen ? "border-primary-green" : "border-white/20 hover:border-primary-green"
    }`,
  };

  const labelStyles =
    "text-sm font-semibold block pl-1";

  const dropdownBgVariants = {
    light: "bg-white border border-border-light text-text-main shadow-lg",
    glass: "bg-gray-500/90 backdrop-blur-md border border-white/30 text-black shadow-2xl",
  };

  const optionHoverVariants = {
    light: "hover:bg-primary-green hover:text-white text-text-main",
    glass: "hover:bg-primary-green text-white",
  };

  return (
    <div className={`flex flex-col gap-2 relative w-full ${containerClassName}`}>
      {label && (
        <label
          className={`${labelStyles} ${
            variant === "glass" ? "text-white" : "text-text-main"
          }`}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`${baseButtonStyles} ${buttonVariants[variant]} ${
          error ? "border-red-400 focus:border-red-400" : ""
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span
          className={`font-medium text-[16px] truncate block flex-1 text-left ${
            selectedOption
              ? variant === "glass"
                ? "text-white"
                : "text-text-main"
              : variant === "glass"
              ? "text-white/50"
              : "text-text-muted"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <HiOutlineChevronDown
          className={`shrink-0 ${variant === "glass" ? "text-white/50" : "text-text-muted"} transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={20}
        />
      </button>

      {isOpen && (
        <>
          {/* Transparent Backdrop Click-away */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          {/* Dropdown Container */}
          <div
            className={`absolute top-[calc(100%+8px)] left-0 w-full rounded-[20px] p-2 z-999 max-h-62.5 overflow-y-auto custom-scrollbar animate-in fade-in duration-200 ${dropdownBgVariants[variant]}`}
          >
            <div className="flex flex-col gap-1">
              {normalizedOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between gap-3 min-h-11.5 py-1.5 px-4 rounded-full cursor-pointer transition-colors group ${
                      isSelected
                        ? "bg-primary-green text-white"
                        : optionHoverVariants[variant]
                    }`}
                  >
                    <span className="font-medium wrap-break-word leading-snug text-[11px] sm:text-[16px]">{opt.label}</span>
                    {isSelected && <HiCheck className="text-white shrink-0" size={20} />}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {error && (
        <p className={`text-xs font-medium pl-3 mt-1 ${variant === "glass" ? "text-red-400" : "text-red-500"}`}>
          {error}
        </p>
      )}
    </div>
  );
}
