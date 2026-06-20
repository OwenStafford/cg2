"use client";

import { useEffect } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { X } from "lucide-react";
import { getStripe } from "@/lib/stripe-client";

export function CheckoutModal({
  clientSecret,
  onClose,
  closeLabel,
}: {
  clientSecret: string;
  onClose: () => void;
  closeLabel: string;
}) {
  // Close on Escape and lock background scroll while the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-coffee-dark/50 backdrop-blur-sm"
    >
      {/* Click-outside backdrop */}
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        tabIndex={-1}
      />

      <div className="relative mx-auto my-8 w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
          <div className="flex justify-end p-2">
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="rounded-full p-2 text-coffee-dark/70 hover:bg-cream hover:text-coffee-dark transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 pb-6">
            <EmbeddedCheckoutProvider
              stripe={getStripe()}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
