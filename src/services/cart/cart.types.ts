export type CartBody = {
  slug: string;
  quantity: number;
  coupon_id?: number;
};

export type CartCouponBody = {
  coupon_id: number | null;
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

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    items: CartItem[];
    total_items: number;
    total_price: number;
    coupon_id?: number | null;
    used_coupon?: CartCoupon | null;
  };
}
