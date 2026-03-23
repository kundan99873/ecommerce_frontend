export type CartBody = {
  slug: string;
  quantity: number;
  coupon_code?: string;
};

export type CartCouponBody = {
  coupon_code: string | null;
};

export type CartProduct = {
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
};

export interface CartItem {
  quantity: number;
  price: number;
  subtotal: number;
  name: string;
  slug: string;
  sku: string;
  stock: number;
  color: string;
  size: string;
  image: string;
}

export interface CartCoupon {
  id: number;
  code: string;
  description?: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  max_discount?: number | null;
  min_purchase?: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface CartAvailableCoupon {
  id: number;
  code: string;
  description?: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  max_discount?: number | null;
  min_purchase?: number | null;
  start_date: string;
  end_date: string;
  max_uses?: number | null;
  max_uses_per_user?: number | null;
  is_global?: boolean;
  is_applied?: boolean;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    items: CartItem[];
    total_items: number;
    total_price: number;
    coupon_discount_amount: number;
    final_price: number;
    used_coupon?: CartCoupon | null;
  };
}
