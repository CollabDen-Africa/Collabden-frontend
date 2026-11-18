export interface PasswordRule {
  id: string;
  /** Short text shown in the checklist */
  label: string;
  /** Sentence shown as a validation error (zod, the reset page, etc.) */
  message: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    message: "Password must be at least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    message: "Password must include at least one uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    message: "Password must include at least one number",
    test: (password) => /\d/.test(password),
  },
];

/** The rules this password does not meet yet (empty array = valid). */
export const getPasswordIssues = (password: string, rules: PasswordRule[] = PASSWORD_RULES) =>
  rules.filter((rule) => !rule.test(password));

export const isPasswordValid = (password: string, rules: PasswordRule[] = PASSWORD_RULES) =>
  getPasswordIssues(password, rules).length === 0;