import React, { createContext, useContext, useState, useCallback } from "react";

export interface Coupon {
  code: string;
  type: "percentage" | "flat";
  value: number;
  minOrder: number;
  expiresAt: string;
  description: string;
}

interface CouponContextType {
  appliedCoupon: Coupon | null;
  discount: number;
  applyCoupon: (code: string, cartTotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  availableCoupons: Coupon[];
}

const COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percentage", value: 10, minOrder: 50, expiresAt: "2026-12-31", description: "10% off on orders above $50" },
  { code: "FLAT20", type: "flat", value: 20, minOrder: 100, expiresAt: "2026-12-31", description: "$20 off on orders above $100" },
  { code: "SAVE15", type: "percentage", value: 15, minOrder: 150, expiresAt: "2026-06-30", description: "15% off on orders above $150" },
  { code: "SUMMER25", type: "flat", value: 25, minOrder: 200, expiresAt: "2026-08-31", description: "$25 off on orders above $200" },
];

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);

  const applyCoupon = useCallback((code: string, cartTotal: number) => {
    const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { success: false, message: "Invalid coupon code" };
    if (new Date(coupon.expiresAt) < new Date()) return { success: false, message: "This coupon has expired" };
    if (cartTotal < coupon.minOrder) return { success: false, message: `Minimum order of $${coupon.minOrder} required` };

    const disc = coupon.type === "percentage" ? (cartTotal * coupon.value) / 100 : coupon.value;
    setAppliedCoupon(coupon);
    setDiscount(Math.min(disc, cartTotal));
    return { success: true, message: `Coupon applied! You save $${Math.min(disc, cartTotal).toFixed(2)}` };
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscount(0);
  }, []);

  return (
    <CouponContext.Provider value={{ appliedCoupon, discount, applyCoupon, removeCoupon, availableCoupons: COUPONS }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error("useCoupon must be used within CouponProvider");
  return ctx;
};
