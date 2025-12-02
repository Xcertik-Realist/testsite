import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center text-white font-bold text-xl">
            SF
          </div>
          <h1 className="text-2xl font-bold text-forest-green">ScandinavianFirs</h1>
        </Link>
        <Link href="/checkout">
          <ShoppingBag className="w-7 h-7 text-forest-green" />
        </Link>
      </div>
    </header>
  );
}
