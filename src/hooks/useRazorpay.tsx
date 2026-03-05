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
      const res = await loadRazorpayScript();

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const paymentOptions = {
        key: RAZORPAY_KEY,
        amount: options.amount * 100, // in paise
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
      paymentObject.open();
    },
    [loadRazorpayScript],
  );

  return { openPayment };
};
