import { MobileAuthForm } from "@/components/auth/mobile-auth-form";
import type { Locale } from "@/lib/i18n/config";

export function LoginForm({ locale }: { locale: Locale }) {
  return <MobileAuthForm locale={locale} />;
}
