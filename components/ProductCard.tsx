"use client";

import Image from "next/image";
import { useState } from "react";
import ProductModal from "./ProductModal";

export default function ProductCard({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-forest-green text-white px-5 py-2 rounded-full font-bold text-lg">
            £{product.price}
          </div>
        </div>

        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold text-charcoal">{product.name}</h3>
          <p className="text-gray-600 mt-2">{product.height}</p>
          <p className="text-sm text-gray-500 mt-4">Click to customise size & stand</p>
        </div>
      </div>

      {isOpen && <ProductModal product={product} onClose={() => setIsOpen(false)} />}
    </>
  );
}
