import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body`}>
        {/* Global providers (CartProvider, LocaleProvider) mount here in a later phase. */}
        {children}
      </body>
    </html>
  );
}
