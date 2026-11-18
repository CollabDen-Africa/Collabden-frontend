import { z } from "zod";
import { getPasswordIssues } from "@/lib/password-rules";

export const signUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string().superRefine((value, ctx) => {
      getPasswordIssues(value).forEach((rule) => ctx.addIssue({ code: "custom", message: rule.message }));
    }),
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms of use and privacy policy"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
