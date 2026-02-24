export interface GetCouponsQuery {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

export interface Coupon {
    id: string;
    code: string;
    description?: string;
    discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
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
    coupons: Coupon[];
    total: number;
    page: number;
    limit: number;
}

export interface CouponBody {
    code: string;
    description?: string;
    discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
    discount_value: number;
    start_date: string;
    end_date: string;
    max_uses?: number | null;
    min_purchase?: number | null;
    is_active: boolean;
    is_global: boolean;
}

