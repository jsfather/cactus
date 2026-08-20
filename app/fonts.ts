import localFont from "next/font/local";

export const vazirmatn = localFont({
  src: "../node_modules/vazirmatn/fonts/webfonts/Vazirmatn[wght].woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});
