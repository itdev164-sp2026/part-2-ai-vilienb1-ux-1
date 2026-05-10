import { z } from 'zod';

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  status: z.enum(['active', 'completed', 'archived']),
});

export type Project = z.infer<typeof projectSchema>;
