// app/checkout/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft } from "lucide-react";

const UK_POSTCODE_REGEX = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i;

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    town: "",
    county: "",
    postcode: "",
    deliveryOption: "standard",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidPostcode, setIsValidPostcode] = useState<boolean | null>(null);

  const deliveryPrices = { standard: 9.99, express: 14.99, chooseday: 19.99 };
  const total = (Number(subtotal) + deliveryPrices[formData.deliveryOption]).toFixed(2);

  // Live postcode validation
  useEffect(() => {
    const pc = formData.postcode.trim();
    if (!pc) {
      setIsValidPostcode(null);
      setErrors(prev => ({ ...prev, postcode: "" }));
      return;
    }
    const cleaned = pc.replace(/\s/g, "").toUpperCase();
    const valid = UK_POSTCODE_REGEX.test(pc) || UK_POSTCODE_REGEX.test(cleaned);
    setIsValidPostcode(valid);
    setErrors(prev => ({ ...prev, postcode: valid ? "" : "Please enter a valid UK postcode" }));
  }, [formData.postcode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const required = ["fullName", "phone", "email", "address1", "town", "county", "postcode"];
    required.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "This field is required";
      }
    });
    if (formData.postcode && !isValidPostcode) {
      newErrors.postcode = "Please enter a valid UK postcode";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const order = {
      ...formData,
      postcode: formData.postcode.toUpperCase().replace(/\s+/g, " ").trim(),
      items: items.map(i => ({
        name: i.name,
        size: i.selectedSize || "Standard",
        stand: i.selectedStand || "None",
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal: Number(subtotal),
      delivery: deliveryPrices[formData.deliveryOption],
      total: Number(total),
      timestamp: new Date().toISOString(),
    };

    const res = await fetch("/api/submit-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      alert("Thank you! Your order has been received and is confirmed.");
      clearCart();
      window.location.href = "/thank-you";
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* === LEFT: FORM === */}
        <div className="lg:w-2/3">
          <a href="/cart" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="w-5 h-5" /> Back to cart
          </a>

          <h1 className="text-4xl font-black mb-10">Shipping Information</h1>

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Contact Details */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Your Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input required placeholder="Full Name" className={`input-field ${errors.fullName ? "border-red-500" : ""}`}
                    value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <input required placeholder="Phone Number" className={`input-field ${errors.phone ? "border-red-500" : ""}`}
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <input required type="email" placeholder="Email Address" className={`input-field ${errors.email ? "border-red-500" : ""}`}
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <input required placeholder="Address Line 1" className={`input-field ${errors.address1 ? "border-red-500" : ""}`}
                    value={formData.address1} onChange={e => setFormData({ ...formData, address1: e.target.value })} />
                  {errors.address1 && <p className="text-red-600 text-sm mt-1">{errors.address1}</p>}
                </div>
                <div className="md:col-span-2">
                  <input placeholder="Address Line 2 (optional)" className="input-field"
                    value={formData.address2} onChange={e => setFormData({ ...formData, address2: e.target.value })} />
                </div>
                <input required placeholder="Town / City" className={`input-field ${errors.town ? "border-red-500" : ""}`}
                  value={formData.town} onChange={e => setFormData({ ...formData, town: e.target.value })} />
                <input required placeholder="County" className={`input-field ${errors.county ? "border-red-500" : ""}`}
                  value={formData.county} onChange={e => setFormData({ ...formData, county: e.target.value })} />
                <div className="md:col-span-2">
                  <input required placeholder="Postcode (e.g. SW1A 1AA)"
                    value={formData.postcode}
                    onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                    className={`input-field ${errors.postcode ? "border-red-500" : isValidPostcode ? "border-green-500" : ""}`} />
                  {errors.postcode && <p className="text-red-600 text-sm mt-1">{errors.postcode}</p>}
                  {isValidPostcode && !errors.postcode && (
                    <p className="text-green-600 text-sm mt-1 flex items-center gap-1">Valid UK postcode</p>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery Options */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Delivery Option</h2>
              <div className="space-y-4">
                {[
                  { id: "standard", price: 9.99, label: "Standard Delivery", desc: "3–5 days after 1st December" },
                  { id: "express", price: 14.99, label: "Express Delivery", desc: "1–2 working days" },
                  { id: "chooseday", price: 19.99, label: "Choose Your Day", desc: "Select your preferred delivery date" },
                ].map(opt => (
                  <label key={opt.id} className={`block p-5 border-2 rounded-lg cursor-pointer transition-all ${formData.deliveryOption === opt.id ? "border-primary bg-primary/5" : "border-gray-300"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="delivery" value={opt.id} checked={formData.deliveryOption === opt.id}
                          onChange={e => setFormData({ ...formData, deliveryOption: e.target.value })} className="w-5 h-5 text-primary" />
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

            {/* Order Notes */}
            <section>
              <label className="block">
                <p className="font-medium mb-2">Order Notes (optional)</p>
                <textarea rows={3} placeholder="e.g. Leave with neighbour, call before delivery..."
                  className="w-full input-field"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })} />
              </label>
            </section>

            {/* Submit */}
            <button type="submit" className="w-full bg-forest-green hover:bg-opacity-90 text-white font-bold text-lg py-5 rounded-lg transition">
              Complete Order & Pay Securely
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Secure checkout • Your data is encrypted and protected
            </p>
          </form>
        </div>

        {/* === RIGHT: ORDER SUMMARY === */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-gray-50 rounded-xl p-8 border">
            <h3 className="text-2xl font-bold mb-6">Your Order</h3>
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
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
                <span>£{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>£{deliveryPrices[formData.deliveryOption].toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4 border-t">
                <span>Total</span>
                <span className="text-primary">£{total}</span>
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
