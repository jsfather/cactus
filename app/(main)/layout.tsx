'use client';

import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
      <Footer />
    </>
  );
}
