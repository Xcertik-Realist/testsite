"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookies-accepted")) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-charcoal text-white p-6 z-50 shadow-2xl">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">We use cookies to improve your experience.</p>
        <button
          onClick={() => {
            localStorage.setItem("cookies-accepted", "true");
            setShow(false);
          }}
          className="bg-primary text-black font-bold px-6 py-3 rounded-full"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
