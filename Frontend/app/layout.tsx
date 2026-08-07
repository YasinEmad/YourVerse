import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { dirForLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getLocaleFromHeaders, getLowMotionFromHeaders } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Multiverse Store",
    template: "%s | Multiverse Store",
  },
  description: "One brand, six universes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocaleFromHeaders();
  const lowMotion = getLowMotionFromHeaders();
  const dict = await getDictionary(locale);
  const dir = dirForLocale(locale);

  return (
    <html lang={locale} dir={dir} data-low-motion={lowMotion ? "true" : "false"}>
      <body className={`${inter.variable} font-body`}>
        <a href="#main-content" className="skip-link">
          {dict.a11y.skipToContent}
        </a>
        <LocaleProvider locale={locale} dict={dict} dir={dir} lowMotion={lowMotion}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
