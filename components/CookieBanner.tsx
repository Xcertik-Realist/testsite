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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-6 z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          We use cookies to ensure you get the best experience. See our <a href="#" className="underline">privacy policy</a>.
        </p>
        <button
          onClick={() => {
            localStorage.setItem("cookies-accepted", "true");
            setShow(false);
          }}
          className="bg-primary text-black font-bold px-6 py-3 rounded-lg"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
