import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-forest-green rounded-full"></div>
          <h1 className="text-2xl font-bold text-forest-green">ScandinavianFirs</h1>
        </Link>
        <Link href="/checkout" className="relative">
          <ShoppingBag className="w-7 h-7 text-forest-green" />
        </Link>
      </div>
    </header>
  );
}
