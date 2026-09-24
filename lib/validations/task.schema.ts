import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task name is required")
    .max(150, "Task name cannot exceed 150 characters"),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  selectedDate: z.date().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
