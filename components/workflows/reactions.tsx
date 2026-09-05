import { eq } from "drizzle-orm";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { contentReactions } from "@/lib/db/schema";
import { reactToContent } from "@/lib/resources/reactions";
import { ActionButton } from "./action-form";
import { text } from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
export async function Reactions({kind,id,locale}:{kind:"post"|"course";id:string;locale:Locale}){const user=await getCurrentUser();const rows=await getDatabase().select().from(contentReactions).where(eq(kind==="post"?contentReactions.postId:contentReactions.courseId,id));const mine=rows.find(r=>r.userId===user?.id)?.value;return <section className="mx-auto max-w-3xl space-y-4 px-5 py-8"><h2 className="font-bold">{kind==="course"?text(locale,"امتیاز دوره","Course rating"):text(locale,"نظر شما درباره این نوشته","Was this article helpful?")}</h2><p className="text-sm text-zinc-500">{kind==="course"?`${rows.length?(rows.reduce((n,r)=>n+r.value,0)/rows.length).toFixed(1):"—"} / 5 · ${rows.length}`:`👍 ${rows.filter(r=>r.value===1).length} · 👎 ${rows.filter(r=>r.value===2).length}`}</p>{user?<div className="flex flex-wrap gap-2">{(kind==="post"?[1,2]:[1,2,3,4,5]).map(value=><ActionButton key={value} locale={locale} action={reactToContent.bind(null,kind,id,mine===value?0:value,locale)} label={`${mine===value?"✓ ":""}${kind==="post"?(value===1?text(locale,"مفید بود","Helpful"):text(locale,"مفید نبود","Not helpful")):`${value} ★`}`}/>)}</div>:<Link className="text-emerald-700 dark:text-emerald-400" href="/login">{text(locale,"برای ثبت نظر وارد شوید","Sign in to rate")}</Link>}</section>;}
