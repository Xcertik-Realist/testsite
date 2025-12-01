import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/contexts/CartContext";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "ScandinavianFirs.com - Premium Real Christmas Trees | UK Delivery",
  description: "Sustainably-grown premium Scandinavian Nordmann Firs delivered fresh from 1st December.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="sitemap" href="/sitemap.xml" />
      </head>
      <body className={`${manrope.variable} font-display bg-background-light`}>
        <CartProvider>
          <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CookieBanner />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
