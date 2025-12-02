"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postcode: "",
    deliveryOption: "standard" as "standard" | "express" | "chooseday",
  });

  const [isValidPostcode, setIsValidPostcode] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // UK postcode regex (very permissive but catches most valid formats)
  const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

  useEffect(() => {
    if (formData.postcode.length > 5) {
      setIsValidPostcode(ukPostcodeRegex.test(formData.postcode.trim()));
    } else {
      setIsValidPostcode(null);
    }
  }, [formData.postcode]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  // Fixed: proper typing with "as const"
  const deliveryPrices = {
    standard: 9.99,
    express: 14.99,
    chooseday: 19.99,
  } as const;

  const deliveryPrice = deliveryPrices[formData.deliveryOption];
  const total = (Number(subtotal) + deliveryPrice).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPostcode) return;

    setIsSubmitting(true);
    try {
      const order = {
        items,
        customer: formData,
        subtotal: Number(subtotal),
        delivery: deliveryPrice,
        total: Number(total),
        timestamp: new Date().toISOString(),
      };

      const res = await fetch("/api/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        clearCart();
        setSubmitStatus("success");
        setTimeout(() => router.push("/thank-you"), 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <a href="/" className="text-green-700 hover:underline text-xl">← Back to trees</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900">
          Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Your Order</h2>
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between py-3 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.selectedSize && <p className="text-sm text-gray-600">{item.selectedSize}</p>}
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">£{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="mt-6 space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({formData.deliveryOption})</span>
                <span>£{deliveryPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4 border-t">
                <span>Total</span>
                <span className="text-green-700">£{total}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-green-700 focus:outline-none text-lg"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-green-700 focus:outline-none text-lg"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-green-700 focus:outline-none text-lg"
              />
              <textarea
                placeholder="Delivery Address"
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-green-700 focus:outline-none text-lg resize-none"
              />
              <div>
                <input
                  type="text"
                  placeholder="Postcode (e.g. SW1A 1AA)"
                  required
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                  className={`w-full px-5 py-4 rounded-xl border focus:outline-none text-lg ${
                    isValidPostcode === false
                      ? "border-red-500"
                      : isValidPostcode
                      ? "border-green-500"
                      : "border-gray-300 focus:border-green-700"
                  }`}
                />
                {isValidPostcode === false && (
                  <p className="text-red-600 text-sm mt-2">Please enter a valid UK postcode</p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium mb-3">Delivery Option</label>
                <select
                  value={formData.deliveryOption}
                  onChange={(e) => setFormData({ ...formData, deliveryOption: e.target.value as any })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-green-700 focus:outline-none text-lg"
                >
                  <option value="standard">Standard (£3.99) – 3–5 days</option>
                  <option value="express">Express (£8.99) – Next day</option>
                  <option value="chooseday">Choose Day (£9.99) – Pick your date</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isValidPostcode || submitStatus === "success"}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold text-xl py-6 rounded-xl transition mt-8"
              >
                {isSubmitting
                  ? "Processing..."
                  : submitStatus === "success"
                  ? "Order Confirmed!"
                  : "Complete Order"}
              </button>

              {submitStatus === "error" && (
                <p className="text-red-600 text-center font-medium">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
