import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/contexts/CartContext";  // ← This line must be exact

export const metadata: Metadata = {
  title: "ScandinavianFirs.com - Premium Real Christmas Trees",
  description: "Real Christmas Trees Delivered UK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background-light font-display">
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
