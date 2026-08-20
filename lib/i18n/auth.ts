import type { Locale } from "./config";

const authDictionaries = {
  fa: {
    metadataTitle: "ورود | کاکتوس",
    metadataDescription: "ورود به پنل مدرسه رباتیک کاکتوس",
    backHome: "بازگشت به صفحه اصلی",
    title: "ورود به پنل",
    description:
      "مدیر، مدرس و دانش‌آموز از همین صفحه وارد فضای اختصاصی خود می‌شوند.",
    email: "ایمیل",
    password: "رمز عبور",
    submit: "ورود به پنل",
    submitting: "در حال ورود…",
    invalidCredentials: "ایمیل یا رمز عبور معتبر نیست.",
  },
  en: {
    metadataTitle: "Sign in | Cactus",
    metadataDescription: "Sign in to the Cactus Robotics School panel",
    backHome: "Back to homepage",
    title: "Sign in to the panel",
    description:
      "Administrators, teachers, and students sign in here to access their workspace.",
    email: "Email",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
    invalidCredentials: "The email or password is invalid.",
  },
} as const;

export function getAuthDictionary(locale: Locale) {
  return authDictionaries[locale];
}
