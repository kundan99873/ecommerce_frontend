export type DiscountType = "percentage" | "fixed";

export interface AdminCoupon {
  id: number;
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  start_date: string;
  end_date: string;
  max_uses: number | null;
  min_purchase: number | null;
  is_active: boolean;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

let couponStore: AdminCoupon[] = [
  {
    id: 1, code: "WELCOME10", description: "10% off on orders above $50", discount_type: "percentage",
    discount_value: 10, start_date: "2025-01-01", end_date: "2026-12-31", max_uses: 1000,
    min_purchase: 50, is_active: true, is_global: true, created_at: "2025-01-01", updated_at: "2025-01-01",
  },
  {
    id: 2, code: "FLAT20", description: "$20 off on orders above $100", discount_type: "fixed",
    discount_value: 20, start_date: "2025-01-01", end_date: "2026-12-31", max_uses: 500,
    min_purchase: 100, is_active: true, is_global: true, created_at: "2025-01-15", updated_at: "2025-01-15",
  },
  {
    id: 3, code: "SAVE15", description: "15% off on orders above $150", discount_type: "percentage",
    discount_value: 15, start_date: "2025-01-01", end_date: "2026-06-30", max_uses: null,
    min_purchase: 150, is_active: true, is_global: false, created_at: "2025-02-01", updated_at: "2025-02-01",
  },
  {
    id: 4, code: "SUMMER25", description: "$25 off on orders above $200", discount_type: "fixed",
    discount_value: 25, start_date: "2025-06-01", end_date: "2026-08-31", max_uses: 200,
    min_purchase: 200, is_active: false, is_global: false, created_at: "2025-03-01", updated_at: "2025-03-01",
  },
];

export type CouponFormData = Omit<AdminCoupon, "id" | "created_at" | "updated_at">;

export const couponService = {
  getAll: async (): Promise<AdminCoupon[]> => {
    await new Promise((r) => setTimeout(r, 200));
    return [...couponStore];
  },

  create: async (data: CouponFormData): Promise<AdminCoupon> => {
    await new Promise((r) => setTimeout(r, 300));
    const exists = couponStore.some((c) => c.code.toUpperCase() === data.code.toUpperCase());
    if (exists) throw new Error("Coupon code already exists");
    const now = new Date().toISOString();
    const coupon: AdminCoupon = { ...data, id: Date.now(), created_at: now, updated_at: now };
    couponStore = [coupon, ...couponStore];
    return coupon;
  },

  update: async (id: number, data: Partial<CouponFormData>): Promise<AdminCoupon> => {
    await new Promise((r) => setTimeout(r, 300));
    if (data.code) {
      const exists = couponStore.some((c) => c.code.toUpperCase() === data.code!.toUpperCase() && c.id !== id);
      if (exists) throw new Error("Coupon code already exists");
    }
    couponStore = couponStore.map((c) =>
      c.id === id ? { ...c, ...data, updated_at: new Date().toISOString() } : c
    );
    return couponStore.find((c) => c.id === id)!;
  },

  delete: async (id: number): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    couponStore = couponStore.filter((c) => c.id !== id);
  },
};
