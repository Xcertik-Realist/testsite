"use client";
import Image from "next/image";
import { useState } from "react";
import ProductModal from "./ProductModal";

export default function ProductCard({ product }: { product: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-forest-green text-white px-4 py-2 rounded-full font-bold">
            £{product.price}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.height}</p>
        </div>
      </div>

      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
