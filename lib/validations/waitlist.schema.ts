import { z } from "zod";

export const waitlistSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .trim(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
