"use server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { resources, appSettings } from "@/lib/db/schema";
import { softwareMetadataSchema, softwareSettingKey } from "./software";
import { sanitizeRichText } from "@/lib/content/rich-text";
import { resourceKind } from "./config";
import {
  optionalUrl,
  validationError,
  saved,
  failed,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
const schema = z.object({
  categoryFa: z.string().max(120).optional(),
  categoryEn: z.string().max(120).optional(),
  platforms: z.string().max(240).optional(),
  version: z.string().max(120).optional(),
  documentationUrl: optionalUrl.optional(),
  titleFa: z.string().trim().min(2).max(240),
  titleEn: z.string().trim().max(240),
  contentFa: z.string().min(2).max(100000),
  contentEn: z.string().max(100000),
  audience: z.enum(["all", "student", "teacher", "admin", "member"]),
  status: z.enum(["draft", "published"]),
  attachmentUrl: optionalUrl,
  sortOrder: z.coerce.number().int().min(0).max(10000),
});
export async function saveResource(
  kindValue: string,
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin", "content");
  const kind = resourceKind.parse(kindValue);
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  const metadata =
    kind === "requirements"
      ? softwareMetadataSchema.safeParse(Object.fromEntries(form))
      : null;
  if (metadata && !metadata.success)
    return validationError(locale, metadata.error);
  if (id && !z.uuid().safeParse(id).success) return failed(locale);
  const data = {
    ...parsed.data,
    kind,
    contentFa: sanitizeRichText(parsed.data.contentFa),
    contentEn: sanitizeRichText(parsed.data.contentEn),
    updatedAt: new Date(),
  };
  try {
    await getDatabase().transaction(async (tx) => {
      const [item] = id
        ? await tx
            .update(resources)
            .set(data)
            .where(and(eq(resources.id, id), eq(resources.kind, kind)))
            .returning({ id: resources.id })
        : await tx
            .insert(resources)
            .values(data)
            .returning({ id: resources.id });
      if (!item) throw new Error("Resource not found");
      if (metadata?.success)
        await tx
          .insert(appSettings)
          .values({
            key: softwareSettingKey(item.id),
            value: JSON.stringify(metadata.data),
          })
          .onConflictDoUpdate({
            target: appSettings.key,
            set: {
              value: JSON.stringify(metadata.data),
              updatedAt: new Date(),
            },
          });
    });
  } catch {
    return failed(locale);
  }
  revalidatePath("/", "layout");
  redirect(`/panel/admin/resources/${kind}?saved=1`);
}
export async function deleteResource(
  kindValue: string,
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin", "content");
  const kind = resourceKind.parse(kindValue);
  if (!z.uuid().safeParse(id).success) return failed(locale);
  try {
    await getDatabase().transaction(async (tx) => {
      await tx
        .delete(resources)
        .where(and(eq(resources.id, id), eq(resources.kind, kind)));
      if (kind === "requirements")
        await tx
          .delete(appSettings)
          .where(eq(appSettings.key, softwareSettingKey(id)));
    });
  } catch {
    return failed(locale);
  }
  revalidatePath("/", "layout");
  return saved(locale);
}
