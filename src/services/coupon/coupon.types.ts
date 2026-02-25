export interface GetCouponsQuery {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  start_date: string;
  end_date: string;
  max_uses?: number | null;
  min_purchase?: number | null;
  is_active: boolean;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponResponse {
  success: boolean;
  data: Coupon[];
  message: string;
  totalCounts: number;
}

export interface CouponBody {
  code: string;
  description?: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  start_date: string;
  end_date: string;
  max_uses?: number | null;
  min_purchase?: number | null;
  is_active: boolean;
  is_global: boolean;
}

export interface UpdateCouponBody {
  code?: string;
  description?: string;
  discount_type?: "PERCENTAGE" | "FIXED";
  discount_value?: number;
  start_date?: string;
  end_date?: string;
  max_uses?: number | null;
  min_purchase?: number | null;
  is_active?: boolean;
  is_global?: boolean;
}
