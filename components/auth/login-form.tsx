import { MobileAuthForm } from "@/components/auth/mobile-auth-form";
import type { Locale } from "@/lib/i18n/config";

export function LoginForm({ locale, returnTo }: { locale: Locale; returnTo?: string }) {
  return <MobileAuthForm locale={locale} returnTo={returnTo} />;
}
