'use client';

import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import { LocaleProvider } from '@/app/contexts/LocaleContext';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <LocaleProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
