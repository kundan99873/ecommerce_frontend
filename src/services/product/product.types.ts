export interface ProductVariant {
  color: string;
  size: string;
  original_price: number;
  discounted_price: number;
  stock: number;
  sku: string;
  id: number;
  images: {
    image_url: string;
    id?: number;
  }[];
  removed_image_ids?: string[];
}

export type DiscountType = "FIXED" | "PERCENTAGE";

export interface ProductCoupon {
  id?: number;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_discount: number | null;
  description: string;
  min_purchase: number | null;
  start_date: string;
  end_date: string;
}

export interface ProductReview {
  id?: number;
  rating: number;
  comment: string;
  created_at?: string;
  user?: {
    id?: number;
    name?: string;
    avatar_url?: string;
  };
}

export interface Product {
  name: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  brand: string;
  slug: string;
  is_active: boolean;
  rating?: number;
  reviews?: number;
  variants: ProductVariant[];
}

export interface ProductWithoutVariant {
  name: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  brand: string;
  slug: string;
  is_active: boolean;
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  message: string;
  totalCounts: number;
}
export interface ProductWithoutVariantResponse {
  success: boolean;
  data: ProductWithoutVariant[];
  message: string;
  totalCounts: number;
}

export type SortOptions = "price_low" | "price_high" | "top_rated" | "newest";
export type FilterOptions =
  | "in_stock"
  | "out_of_stock"
  | "featured"
  | "trending";

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  sort?: SortOptions;
  filter?: FilterOptions;
  is_product_listing_page?: boolean;
}

export interface ProductDetail {
  name: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  brand: string;
  slug: string;
  is_active: boolean;
  rating?: number;
  reviews?: number;
  variants: ProductVariant[];
  coupons: ProductCoupon[];
  selected_variant: ProductVariant;
  product_reviews?: ProductReview[];
}

export interface ProductWithSlugResponse {
  success: boolean;
  data: ProductDetail;
  message: string;
}

export interface ProductReviewsResponse {
  success: boolean;
  data: ProductReview[];
  message: string;
  totalCounts?: number;
}
