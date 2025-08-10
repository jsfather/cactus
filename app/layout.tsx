import type { Metadata } from 'next';
import '@/app/globals.css';
import { dana, danaFaNum } from '@/app/fonts';
import { CartProvider } from '@/app/contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script';

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
        <CartProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </CartProvider>
      </body>
      <Script
        id="goftino-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(){
              var i="wsEPPL",a=window,d=document;
              function g(){
                var g=d.createElement("script"),
                s="https://www.goftino.com/widget/"+i,
                l=localStorage.getItem("goftino_"+i);
                g.async=!0;
                g.src=l ? s+"?o="+l : s;
                d.getElementsByTagName("head")[0].appendChild(g);
              }
              "complete"===d.readyState ? g() : a.attachEvent ? a.attachEvent("onload",g) : a.addEventListener("load",g,!1);
            }();
          `,
        }}
      />
    </html>
  );
}
