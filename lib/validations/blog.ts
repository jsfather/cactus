import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  little_description: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Short description is too long"),
  description: z.string().min(1, "Description is required"),
  meta_title: z
    .string()
    .min(1, "Meta title is required")
    .max(255, "Meta title is too long"),
  meta_description: z
    .string()
    .min(1, "Meta description is required")
    .max(500, "Meta description is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  tags: z.array(z.string()).default([]),
  user_id: z.number().positive("User ID must be positive"),
  publish_at: z.string().min(1, "Publish date is required"),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
