"use server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { resources } from "@/lib/db/schema";
import { sanitizeRichText } from "@/lib/content/rich-text";
import { resourceKind } from "./config";
import { optionalUrl, validationError, saved, failed, type ActionState } from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
const schema = z.object({titleFa:z.string().trim().min(2).max(240),titleEn:z.string().trim().max(240),contentFa:z.string().min(2).max(100000),contentEn:z.string().max(100000),audience:z.enum(["all","student","teacher","admin","member"]),status:z.enum(["draft","published"]),attachmentUrl:optionalUrl,sortOrder:z.coerce.number().int().min(0).max(10000)});
export async function saveResource(kindValue: string, id: string | null, _state: ActionState, form: FormData): Promise<ActionState> {
  await requireRole("admin"); const kind=resourceKind.parse(kindValue); const locale=form.get("locale")==="en"?"en":"fa";
  const parsed=schema.safeParse(Object.fromEntries(form)); if(!parsed.success)return validationError(locale,parsed.error);
  if(id && !z.uuid().safeParse(id).success)return failed(locale);
  const data={...parsed.data,kind,contentFa:sanitizeRichText(parsed.data.contentFa),contentEn:sanitizeRichText(parsed.data.contentEn),updatedAt:new Date()};
  try {if(id)await getDatabase().update(resources).set(data).where(and(eq(resources.id,id),eq(resources.kind,kind)));else await getDatabase().insert(resources).values(data);}catch{return failed(locale);}
  revalidatePath("/", "layout"); redirect(`/panel/admin/resources/${kind}?saved=1`);
}
export async function deleteResource(kindValue: string,id:string,locale:Locale):Promise<ActionState>{await requireRole("admin");const kind=resourceKind.parse(kindValue);if(!z.uuid().safeParse(id).success)return failed(locale);await getDatabase().delete(resources).where(and(eq(resources.id,id),eq(resources.kind,kind)));revalidatePath("/","layout");return saved(locale);}
