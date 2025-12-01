// app/checkout/page.tsx
"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    town: "",
    county: "",
    postcode: "",
    phone: "",
    email: "",
    deliveryOption: "standard",
    notes: "",
  });

  const deliveryPrices: Record<string, number> = {
    standard: 9.99,
    express: 14.99,
    chooseday: 19.99,
  };

  const total = subtotal + deliveryPrices[formData.deliveryOption];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const order = {
      ...formData,
      items: items.map(i => ({
        name: i.name,
        size: i.selectedSize,
        stand: i.selectedStand,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal,
      delivery: deliveryPrices[formData.deliveryOption],
      total,
      timestamp: new Date().toISOString(),
    };

    const res = await fetch("/api/submit-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      alert("Order received! We'll call you to confirm & take payment securely over the phone.");
      clearCart();
      window.location.href = "/";
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Form */}
        <div className="lg:w-2/3">
          <div className="mb-8">
            <a href="/cart" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="w-5 h-5" /> Back to cart
            </a>
          </div>

          <h1 className="text-4xl font-black mb-8">Shipping Information</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6">Where should we send your tree?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Full Name" className="input-field" onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                <input required placeholder="Phone Number" className="input-field" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                <input required placeholder="Email Address" type="email" className="input-field md:col-span-2" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                <input required placeholder="Address Line 1" className="input-field md:col-span-2" onChange={e => setFormData({ ...formData, address1: e.target.value })} />
                <input placeholder="Address Line 2 (optional)" className="input-field md:col-span-2" onChange={e => setFormData({ ...formData, address2: e.target.value })} />
                <input required placeholder="Town / City" className="input-field" onChange={e => setFormData({ ...formData, town: e.target.value })} />
                <input required placeholder="County" className="input-field" onChange={e => setFormData({ ...formData, county: e.target.value })} />
                <input required placeholder="Postcode" className="input-field" onChange={e => setFormData({ ...formData, postcode: e.target.value })} />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Delivery Option</h2>
              <div className="space-y-4">
                {[
                  { id: "standard", price: 9.99, label: "Standard Delivery", desc: "3–5 working days after 1st Dec" },
                  { id: "express", price: 14.99, label: "Express Delivery", desc: "1–2 working days" },
                  { id: "chooseday", price: 19.99, label: "Choose Your Day", desc: "Pick your perfect delivery date" },
                ].map(opt => (
                  <label key={opt.id} className={`block p-5 border-2 rounded-lg cursor-pointer transition-all ${formData.deliveryOption === opt.id ? "border-primary bg-primary/5" : "border-gray-300"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="delivery" value={opt.id} checked={formData.deliveryOption === opt.id} onChange={e => setFormData({ ...formData, deliveryOption: e.target.value })} className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-bold">{opt.label}</p>
                          <p className="text-sm text-gray-600">{opt.desc}</p>
                        </div>
                      </div>
                      <p className="font-bold">£{opt.price.toFixed(2)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <label className="block">
                <p className="font-medium mb-2">Order Notes (optional)</p>
                <textarea rows={3} placeholder="e.g. Leave with neighbour, call before delivery..." className="w-full input-field" onChange={e => setFormData({ ...formData, notes: e.target.value })} />
              </label>
            </section>

            <button type="submit" className="w-full bg-forest-green hover:bg-opacity-90 text-white font-bold text-lg py-5 rounded-lg transition">
              Complete Order – We’ll Call You to Take Payment
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Your card details are never stored. We’ll call you within 24hrs to securely take payment over the phone.
            </p>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-gray-50 rounded-xl p-8 border">
            <h3 className="text-2xl font-bold mb-6">Your Order</h3>
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.selectedSize} • {item.selectedStand}</p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t mt-8 pt-6 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>£{deliveryPrices[formData.deliveryOption].toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4 border-t">
                <span>Total</span>
                <span className="text-primary">£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          @apply w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition;
        }
      `}</style>
    </div>
  );
}
