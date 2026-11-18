"use client";

import { useMemo } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { PASSWORD_RULES, type PasswordRule } from "@/lib/password-rules";

interface PasswordChecklistProps {
  /** The current value of the password field, e.g. watch("password") */
  password: string;
  /** Override the requirements shown. Defaults to PASSWORD_RULES. */
  rules?: PasswordRule[];
  /** "light" for white/light cards (signup), "dark" for dark backgrounds (reset password) */
  variant?: "light" | "dark";
  className?: string;
}

const STYLES = {
  light: {
    met: { icon: "bg-primary-green/15 text-primary-green", label: "text-gray-700" },
    idle: { icon: "bg-gray-100 text-gray-400", label: "text-gray-400" }, // nothing typed yet
    unmet: { icon: "bg-red-50 text-red-500", label: "text-red-500" }, // typing, not met yet
  },
  dark: {
    met: { icon: "bg-primary-green/20 text-primary-green", label: "text-white/90" },
    idle: { icon: "bg-white/10 text-white/40", label: "text-white/40" },
    unmet: { icon: "bg-red-500/15 text-red-400", label: "text-red-400" },
  },
} as const;

export default function PasswordChecklist({
  password,
  rules = PASSWORD_RULES,
  variant = "light",
  className = "",
}: PasswordChecklistProps) {
  const value = password ?? "";
  const results = useMemo(
    () => rules.map((rule) => ({ rule, met: rule.test(value) })),
    [rules, value]
  );
  const hasInput = value.length > 0;
  const styles = STYLES[variant];

  return (
    <ul aria-label="Password requirements" className={`space-y-1.5 ${className}`}>
      {results.map(({ rule, met }) => {
        const state = met ? styles.met : hasInput ? styles.unmet : styles.idle;
        return (
          <li key={rule.id} className="flex items-center gap-2 text-xs font-medium">
            <span
              aria-hidden="true"
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${state.icon}`}
            >
              {met ? <FiCheck size={11} strokeWidth={3} /> : <FiX size={11} strokeWidth={3} />}
            </span>
            <span className={`transition-colors duration-200 ${state.label}`}>{rule.label}</span>
            {/* Icons are decorative, so say the status in words for screen readers */}
            <span className="sr-only">{met ? "(met)" : "(not met)"}</span>
          </li>
        );
      })}
    </ul>
  );
}