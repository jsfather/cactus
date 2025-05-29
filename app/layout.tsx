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
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <body
        className={`${danaFaNum.variable} ${dana.variable} font-dana-fanum min-h-screen bg-white text-gray-900 antialiased transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
