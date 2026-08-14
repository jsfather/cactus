'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '@/app/lib/hooks/use-settings';
import { useEffect } from 'react';
import { useLocale } from '@/app/contexts/LocaleContext';

export default function Footer() {
  const { settings, fetchSettings } = useSettings();
  const { t } = useLocale();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const quickLinks = [
    { title: t.nav.courses, href: '/courses' },
    { title: t.nav.teachers, href: '/teachers' },
    { title: t.nav.about, href: '/about' },
    { title: t.nav.blog, href: '/blog' },
  ];
  const serviceLinks = [
    { title: t.nav.shop, href: '/shop' },
    { title: t.nav.certifications, href: '/certifications' },
    { title: t.nav.requirements, href: '/requirements' },
  ];

  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr] lg:gap-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-xl"
            >
              <Image
                src="/logo.svg"
                alt="لوگو کاکتوس"
                width={44}
                height={38}
                className="brightness-0 invert"
              />
              <span className="text-xl font-black text-white">
                {t.common.siteName}
              </span>
            </Link>
            <p className="mt-5 max-w-sm leading-7 text-gray-400">
              {t.footer.description}
            </p>
            <a
              referrerPolicy="origin"
              target="_blank"
              rel="noopener noreferrer"
              href="https://trustseal.enamad.ir/?id=644259&Code=NQ6KftoTWfPqW2ucLd1nKGXwRVOJWJT8"
              className="mt-6 inline-flex rounded-xl bg-white p-2 transition-transform hover:-translate-y-0.5"
              aria-label="مشاهده نماد اعتماد الکترونیکی"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=644259&Code=NQ6KftoTWfPqW2ucLd1nKGXwRVOJWJT8"
                alt="نماد اعتماد الکترونیکی"
                className="h-20 w-auto"
              />
            </a>
          </div>

          <FooterLinks title={t.footer.quickLinks} links={quickLinks} />
          <FooterLinks title={t.common.more} links={serviceLinks} />

          <div>
            <h2 className="text-sm font-bold text-white">
              {t.footer.contactUs}
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <Phone
                  className="text-primary-400 mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
                {settings?.phone ? (
                  <a
                    dir="ltr"
                    href={`tel:${settings.phone}`}
                    className="transition-colors hover:text-white"
                  >
                    {settings.phone}
                  </a>
                ) : (
                  <FooterSkeleton width="w-24" />
                )}
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  className="text-primary-400 mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
                {settings?.email ? (
                  <a
                    dir="ltr"
                    href={`mailto:${settings.email}`}
                    className="break-all transition-colors hover:text-white"
                  >
                    {settings.email}
                  </a>
                ) : (
                  <FooterSkeleton width="w-32" />
                )}
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="text-primary-400 mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
                {settings?.address ? (
                  <span className="leading-7">{settings.address}</span>
                ) : (
                  <FooterSkeleton width="w-40" />
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-500 sm:text-start">
          {settings?.footer_text ? (
            <p>{settings.footer_text}</p>
          ) : (
            <FooterSkeleton width="w-64" />
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-gray-400">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-8 items-center transition-colors hover:text-white"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterSkeleton({ width }: { width: string }) {
  return (
    <span
      className={`inline-block h-4 animate-pulse rounded bg-gray-800 ${width}`}
      aria-hidden="true"
    />
  );
}
