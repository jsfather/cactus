import type { Metadata } from 'next';
import '@/app/ui/globals.css';
import { dana, danaFaNum } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'کاکتوس',
  description: 'آموزش‌های حضوری و آنلاین رباتیک',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${danaFaNum.variable} ${dana.variable} font-dana-fanum`}
      >
        {children}
      </body>
    </html>
  );
}
