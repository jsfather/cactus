import { eq } from "drizzle-orm";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { comments } from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { replyToComment } from "@/lib/resources/reactions";
import { ActionForm } from "@/components/workflows/action-form";
import { PanelPage,PanelPageHeader } from "@/components/panel/ui";
export default async function Page({params}:{params:Promise<{id:string}>}){await requireRole("admin");const locale=await getPanelLocale();const {id}=await params;if(!z.uuid().safeParse(id).success)notFound();const [comment]=await getDatabase().select().from(comments).where(eq(comments.id,id));if(!comment)notFound();return <PanelPage><PanelPageHeader eyebrow={locale==="fa"?"دیدگاه":"Comment"} title={locale==="fa"?"پاسخ به دیدگاه":"Reply to comment"} description={comment.body}/><ActionForm locale={locale} action={replyToComment.bind(null,id)} initial={{replyFa:comment.replyFa??"",replyEn:comment.replyEn??""}} fields={[{name:"replyFa",label:locale==="fa"?"پاسخ فارسی":"Persian reply",type:"textarea"},{name:"replyEn",label:locale==="fa"?"پاسخ انگلیسی":"English reply",type:"textarea"}]}/></PanelPage>;}
