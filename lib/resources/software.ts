import { z } from "zod";
import { isAllowedImageReference } from "@/lib/media/reference";

export const softwareMetadataSchema = z.object({
  imageUrl: z
    .string()
    .trim()
    .max(2048)
    .refine(isAllowedImageReference)
    .default(""),
  summaryFa: z.string().trim().max(600).default(""),
  summaryEn: z.string().trim().max(600).default(""),
  developer: z.string().trim().max(160).default(""),
  licenseFa: z.string().trim().max(160).default(""),
  licenseEn: z.string().trim().max(160).default(""),
  requirementsFa: z.string().trim().max(4000).default(""),
  requirementsEn: z.string().trim().max(4000).default(""),
  downloadSize: z.string().trim().max(80).default(""),
});
export type SoftwareMetadata = z.infer<typeof softwareMetadataSchema>;
export function parseSoftwareMetadata(value: unknown): SoftwareMetadata {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      value = {};
    }
  }
  const parsed = softwareMetadataSchema.safeParse(value);
  return parsed.success ? parsed.data : softwareMetadataSchema.parse({});
}
export const softwareSettingKey = (id: string) => `software.${id}`;
