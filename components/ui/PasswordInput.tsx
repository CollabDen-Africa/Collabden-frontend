import React, { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input, { InputProps } from "./Input";

export type PasswordInputProps = Omit<InputProps, "type">;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = "", variant = "glass", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        variant={variant}
        className={`pr-12 ${className}`}
        {...props}
      >
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center cursor-pointer ${
            variant === "glass" ? "text-white/50 hover:text-white" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </Input>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
