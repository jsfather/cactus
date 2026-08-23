import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { CactusBrand, CactusLogo } from "@/components/brand/cactus-brand";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";
import { getCurrentUser } from "@/lib/auth/session";
import { getAuthDictionary } from "@/lib/i18n/auth";
import { localizePath } from "@/lib/i18n/config";
import { getPreferredLocale } from "@/lib/i18n/server";

function FeatureIcon({ name }: { name: "spark" | "shield" | "path" }) {
  const common = { viewBox: "0 0 24 24", className: "size-5", fill: "none", stroke: "currentColor", strokeWidth: 1.7 };
  if (name === "shield") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.8 19 5.7v5.2c0 4.4-2.9 7.7-7 9.6-4.1-1.9-7-5.2-7-9.6V5.7l7-2.9Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m8.7 11.5 2.1 2.1 4.6-4.7" /></svg>;
  if (name === "path") return <svg {...common} aria-hidden="true"><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="6" r="2.2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 17c5-.5 1-6 5-7.2 1.1-.4 2.1-.8 3-1.8" /></svg>;
  return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m12 2 1.5 5.2L19 9l-5.5 1.8L12 16l-1.5-5.2L5 9l5.5-1.8L12 2ZM18.5 15l.7 2.3 2.3.7-2.3.8-.7 2.2-.8-2.2-2.2-.8 2.2-.7.8-2.3Z" /></svg>;
}

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/panel");

  const locale = await getPreferredLocale();
  const dictionary = getAuthDictionary(locale);
  const isFa = locale === "fa";
  const alternateLocale = isFa ? "en" : "fa";
  const languageHref = `/api/preferences/locale?locale=${alternateLocale}&returnTo=${encodeURIComponent("/login")}`;
  const features = isFa ? [
    { icon: "spark" as const, title: "یک مسیر، بدون سردرگمی", text: "سامانه خودش تشخیص می‌دهد باید وارد شوید یا حساب جدید بسازید." },
    { icon: "shield" as const, title: "ورود امن و سریع", text: "با کد یک‌بارمصرف یا رمز عبور شخصی وارد فضای خود شوید." },
    { icon: "path" as const, title: "همراه مسیر یادگیری", text: "به دوره‌ها، پروژه‌ها و فضای اختصاصی نقش خود دسترسی پیدا کنید." },
  ] : [
    { icon: "spark" as const, title: "One clear path", text: "The system determines whether to sign you in or create a new account." },
    { icon: "shield" as const, title: "Secure and effortless", text: "Use a one-time code or your personal password to access your workspace." },
    { icon: "path" as const, title: "Built for your journey", text: "Reach your courses, projects, and role-specific learning space." },
  ];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f5f7f3] px-4 py-4 sm:px-6 sm:py-6 dark:bg-[#07110d]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-32 -top-32 size-96 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-700/15" />
        <div className="absolute -bottom-48 -end-32 size-[32rem] rounded-full bg-lime-200/30 blur-3xl dark:bg-lime-800/10" />
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] max-w-7xl flex-col sm:min-h-[calc(100dvh-3rem)]">
        <header className="flex items-center justify-between gap-4 px-2 py-2 sm:px-3">
          <a href={localizePath(locale, "/")} aria-label={dictionary.backHome} className="rounded-xl transition hover:opacity-80"><CactusBrand locale={locale} /></a>
          <div className="flex items-center gap-2">
            <a href={localizePath(locale, "/")} className="hidden rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-white hover:text-emerald-800 sm:inline-flex dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-emerald-300">{dictionary.backHome}</a>
            <PreferencesMenu locale={locale} alternateHref={languageHref} />
          </div>
        </header>

        <div className="grid min-h-0 flex-1 items-stretch gap-4 py-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.8fr)] lg:gap-6">
          <section className="relative hidden min-h-0 overflow-hidden rounded-[2.25rem] bg-emerald-950 p-8 text-white shadow-2xl shadow-emerald-950/20 lg:flex lg:flex-col lg:justify-between xl:p-10 dark:bg-emerald-950/80">
            <div aria-hidden="true" className="absolute inset-0">
              <div className="absolute -end-20 -top-20 size-80 rounded-full border border-white/10" />
              <div className="absolute -end-8 top-12 size-52 rounded-full border border-white/10" />
              <div className="absolute bottom-20 start-16 size-40 rounded-full bg-emerald-400/10 blur-2xl" />
              <svg viewBox="0 0 600 300" className="absolute inset-x-0 bottom-0 w-full text-emerald-400/10" fill="none"><path d="M-20 280C80 165 155 300 255 182s180 25 365-140" stroke="currentColor" strokeWidth="2" /><path d="M-20 310C95 195 190 335 290 215S470 238 630 74" stroke="currentColor" /></svg>
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur"><span className="size-1.5 rounded-full bg-emerald-300" />{isFa ? "مدرسه رباتیک کاکتوس" : "Cactus Robotics School"}</span>
              <h2 className="mt-6 max-w-2xl text-4xl font-black leading-[1.3] xl:text-5xl">{isFa ? "از کنجکاوی تا ساختن آینده، یک قدم فاصله است." : "One step from curiosity to building the future."}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-100/75">{isFa ? "وارد فضای کاکتوس شوید و مسیر یادگیری، پروژه‌ها و تجربه‌های تازه خود را ادامه دهید." : "Enter Cactus and continue your learning path, projects, and new discoveries."}</p>
            </div>
            <div className="relative grid gap-3">
              {features.map((feature) => <div key={feature.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300"><FeatureIcon name={feature.icon} /></span><div><h3 className="text-sm font-bold">{feature.title}</h3><p className="mt-0.5 text-xs leading-5 text-emerald-100/65">{feature.text}</p></div></div>)}
            </div>
          </section>

          <section className="flex min-h-0 items-center justify-center py-2 lg:py-3">
            <div className="w-full max-w-lg">
              <div className="auth-card rounded-[1.75rem] border border-white/80 bg-white/85 p-5 shadow-2xl shadow-emerald-950/[0.08] backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-black/25">
                <div className="auth-card-intro mb-5">
                  <div className="auth-card-logo mb-4 inline-flex rounded-xl bg-emerald-50 p-2 dark:bg-emerald-950/50"><CactusLogo className="size-9" /></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">{isFa ? "خوش آمدید" : "Welcome back"}</p>
                  <h1 className="mt-1.5 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl dark:text-white">{dictionary.title}</h1>
                  <p className="auth-card-description mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">{dictionary.description}</p>
                </div>
                <LoginForm locale={locale} />
                <div className="auth-card-footer mt-5 flex items-center justify-center gap-2 border-t border-zinc-200 pt-4 text-xs text-zinc-400 dark:border-zinc-800"><svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="8" width="12" height="9" rx="2" /><path strokeLinecap="round" d="M6.5 8V6.5a3.5 3.5 0 0 1 7 0V8" /></svg><span>{isFa ? "ارتباط امن و محافظت‌شده" : "Secure, protected connection"}</span></div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
