"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookies-accepted")) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-charcoal text-white p-6 shadow-2xl z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-left">
          We use cookies to give you the best experience. <a href="#" className="underline">Privacy Policy</a>
        </p>
        <button
          onClick={() => {
            localStorage.setItem("cookies-accepted", "true");
            setShow(false);
          }}
          className="bg-primary hover:bg-green-500 text-black font-bold px-8 py-3 rounded-full transition"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
