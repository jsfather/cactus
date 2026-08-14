'use client';

import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import { LocaleProvider } from '@/app/contexts/LocaleContext';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <LocaleProvider>
      <div className="app-shell flex min-h-screen flex-col">
        <Header />
        <main className="public-content flex-1">{children}</main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
