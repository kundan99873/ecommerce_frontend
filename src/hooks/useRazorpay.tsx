import { useCallback } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  amount: number; // in rupees
  currency?: string; // default "INR"
  name: string;
  description?: string;
  email?: string;
  contact?: string;
  orderId?: string; // optional for server-side order
  onSuccess?: (response: any) => void;
  onFailure?: (response: any) => void;
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "";
export const useRazorpay = () => {
  // Load Razorpay SDK dynamically
  const loadRazorpayScript = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  // Function to start payment
  const openPayment = useCallback(
    async (options: RazorpayOptions) => {
      if (!RAZORPAY_KEY) {
        if (options.onFailure) {
          options.onFailure({
            error:
              "Missing Razorpay key. Set VITE_RAZORPAY_KEY in your .env file.",
          });
        }
        return;
      }

      const res = await loadRazorpayScript();

      if (!res) {
        if (options.onFailure) {
          options.onFailure({
            error: "Razorpay SDK failed to load. Check internet/ad-blocker.",
          });
        }
        return;
      }

      if (!window.Razorpay) {
        if (options.onFailure) {
          options.onFailure({
            error: "Razorpay SDK is unavailable in window context.",
          });
        }
        return;
      }

      const paymentOptions = {
        key: RAZORPAY_KEY,
        amount: Math.round(options.amount * 100), // rupees to paise
        currency: options.currency || "INR",
        name: options.name,
        description: options.description,
        order_id: options.orderId,
        prefill: {
          name: options.name,
          email: options.email,
          contact: options.contact,
        },
        theme: {
          color: "#2563EB",
        },
        handler: (response: any) => {
          if (options.onSuccess) options.onSuccess(response);
        },
        modal: {
          ondismiss: () => {
            if (options.onFailure)
              options.onFailure({ error: "Payment cancelled" });
          },
        },
      };

      const paymentObject = new window.Razorpay(paymentOptions);
      paymentObject.on("payment.failed", (response: any) => {
        if (options.onFailure) {
          options.onFailure({
            error:
              response?.error?.description ||
              response?.error?.reason ||
              "Payment failed",
          });
        }
      });
      paymentObject.open();
    },
    [loadRazorpayScript],
  );

  return { openPayment };
};
