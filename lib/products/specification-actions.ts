"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { validationError,saved,denied,type ActionState } from "@/lib/workflows";
export async function saveSpecifications(id:string,_state:ActionState,form:FormData):Promise<ActionState>{await requireRole("admin");const locale=form.get("locale")==="en"?"en":"fa";if(!z.uuid().safeParse(id).success)return denied(locale);const parsed=z.object({specificationsFa:z.string().max(20000),specificationsEn:z.string().max(20000)}).safeParse(Object.fromEntries(form));if(!parsed.success)return validationError(locale,parsed.error);await getDatabase().update(products).set({...parsed.data,updatedAt:new Date()}).where(eq(products.id,id));revalidatePath("/","layout");return saved(locale);}
