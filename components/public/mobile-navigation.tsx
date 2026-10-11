"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { NavigationLink } from "@/lib/site-content/navigation";
import { PublicIcon } from "./icons";
export function MobileNavigation({
  locale,
  currentPath,
  signedIn,
  links,
}: {
  locale: Locale;
  currentPath: string;
  signedIn: boolean;
  links: NavigationLink[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  function close() {
    dialog.current?.close();
  }
  return (
    <div className="public-mobile-menu">
      <button
        ref={trigger}
        aria-label={locale === "fa" ? "فهرست بخش‌های سایت" : "Site navigation"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
      >
        <PublicIcon name="menu" />
      </button>
      <dialog
        ref={dialog}
        className="public-nav-dialog"
        aria-label={locale === "fa" ? "فهرست موبایل" : "Mobile navigation"}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="mobile-nav-panel">
          <div className="mobile-nav-heading">
            <strong>{locale === "fa" ? "کاکتوس" : "Cactus"}</strong>
            <button
              autoFocus
              aria-label={locale === "fa" ? "بستن فهرست" : "Close navigation"}
              onClick={close}
            >
              <PublicIcon name="close" />
            </button>
          </div>
          <Link
            className="public-button mobile-login"
            href={signedIn ? "/panel" : "/login"}
            onClick={close}
          >
            {locale === "fa"
              ? signedIn
                ? "پنل من"
                : "ورود / ثبت‌نام"
              : signedIn
                ? "My panel"
                : "Sign in"}
          </Link>
          <nav className="mobile-nav">
            <Link href={localizePath(locale, "/")} onClick={close}>
              {locale === "fa" ? "خانه" : "Home"}
            </Link>
            {links.map(({ href: path, labelFa: fa, labelEn: en }) => (
              <Link
                key={path}
                href={path.startsWith("/") ? localizePath(locale, path) : path}
                aria-current={
                  currentPath === path || currentPath.startsWith(path + "/")
                    ? "page"
                    : undefined
                }
                onClick={close}
              >
                {locale === "fa" ? fa : en}
                <span aria-hidden="true">{locale === "fa" ? "‹" : "›"}</span>
              </Link>
            ))}
          </nav>
          <div className="mobile-nav-promo">
            <strong>
              {locale === "fa"
                ? "آینده را با کاکتوس بساز"
                : "Build the future with Cactus"}
            </strong>
            <span className="mobile-nav-promo-art">
              <Image
                src="/images/reference-v4/robot-mascot.svg"
                alt=""
                fill
                sizes="90px"
              />
            </span>
          </div>
        </div>
      </dialog>
    </div>
  );
}
