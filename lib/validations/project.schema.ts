import { z } from "zod";

export const createProjectSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name cannot exceed 100 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  selectedGenre: z
    .string()
    .min(1, "Genre/category is required"),
  selectedDate: z
    .date({
      message: "Start date is required",
    }),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  selectedCollabs: z.array(z.string()),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
