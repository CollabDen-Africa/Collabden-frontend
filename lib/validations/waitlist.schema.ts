import { z } from "zod";

export const waitlistSchema = z.object({
  name: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .trim(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
