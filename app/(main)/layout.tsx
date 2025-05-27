'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

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
