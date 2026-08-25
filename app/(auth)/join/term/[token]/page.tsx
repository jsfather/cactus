import Link from "next/link";
import { notFound } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { CactusBrand } from "@/components/brand/cactus-brand";
import { AcceptTermInvitation } from "@/components/terms/accept-term-invitation";
import { getCurrentUser } from "@/lib/auth/session";
import { getPreferredLocale } from "@/lib/i18n/server";
import { getTermInvitationPreview } from "@/lib/terms/queries";

export default async function JoinTermPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) notFound();
  const locale = await getPreferredLocale();
  const [invitation, user] = await Promise.all([getTermInvitationPreview(token, locale), getCurrentUser()]);
  if (!invitation) notFound();
  const isFa = locale === "fa";
  const returnTo = `/join/term/${token}`;
  return <main className="min-h-dvh bg-zinc-50 px-4 py-8 dark:bg-zinc-950 sm:px-6"><div className="mx-auto max-w-lg"><Link href={locale === "fa" ? "/" : "/en"} className="inline-flex"><CactusBrand locale={locale} /></Link><section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900">
    <header className="bg-emerald-950 p-6 text-white"><p className="text-xs font-bold text-emerald-300">{isFa ? "دعوت‌نامه ترم" : "Term invitation"}</p><h1 className="mt-3 text-2xl font-black">{invitation.title}</h1><p className="mt-2 text-sm text-emerald-100/75">{invitation.level}</p></header>
    <div className="space-y-5 p-6"><dl className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950"><dt className="text-xs text-zinc-500">{isFa ? "شروع" : "Starts"}</dt><dd className="nums-en mt-1 font-semibold" dir="ltr">{new Date(`${invitation.startDate}T12:00:00Z`).toLocaleDateString(isFa ? "fa-IR" : "en-US")}</dd></div><div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950"><dt className="text-xs text-zinc-500">{isFa ? "پایان" : "Ends"}</dt><dd className="nums-en mt-1 font-semibold" dir="ltr">{new Date(`${invitation.endDate}T12:00:00Z`).toLocaleDateString(isFa ? "fa-IR" : "en-US")}</dd></div></dl>
      {!invitation.usable ? <p className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700 dark:bg-red-950/35 dark:text-red-300">{isFa ? "این دعوت‌نامه منقضی، غیرفعال یا تکمیل‌شده است." : "This invitation has expired, been revoked, or reached its usage limit."}</p> : user ? user.role === "student" ? <AcceptTermInvitation token={token} locale={locale} /> : <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950/35 dark:text-amber-300">{isFa ? "برای استفاده از این پیوند باید با حساب دانش پژوهی وارد شوید." : "You must use a student account to accept this invitation."}</p> : <div><p className="mb-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{isFa ? "برای پیوستن، وارد حساب دانش پژوهی خود شوید. پس از ورود به همین دعوت‌نامه بازمی‌گردید." : "Sign in with your student account. You will return to this invitation afterward."}</p><LoginForm locale={locale} returnTo={returnTo} /></div>}
    </div></section></div></main>;
}
