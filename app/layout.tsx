import type { Metadata } from 'next';
import '@/app/globals.css';
import { dana, danaFaNum } from '@/app/fonts';

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
    <html
      lang="fa"
      dir="rtl"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  try {
                    let isDark = false;
                    const savedTheme = localStorage.getItem('theme');
                    
                    if (savedTheme) {
                      isDark = savedTheme === 'dark';
                    } else {
                      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    }

                    if (isDark) {
                      document.documentElement.classList.add('dark');
                    }
                  } catch (e) {}
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${danaFaNum.variable} ${dana.variable} font-dana-fanum min-h-screen bg-white text-gray-900 antialiased transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
