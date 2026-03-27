import type { CartItem } from "../cart/cart.types";
import type { Coupon } from "../coupon/coupon.types";
import type { Order } from "../order/order.types";
import type { Product } from "../product/product.types";

export interface AddAddressBody {
  first_name: string;
  last_name: string;
  phone_number: string;
  phone_code: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  landmark?: string;
}

export interface Address {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  phone_code: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  landmark?: string;
  is_default: boolean;
}

export interface GetUserAddressesResponse {
  success: boolean;
  message: string;
  data: Address[];
}

export interface GetAllUsersParam {
  search?: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  status?: "active" | "inactive";
  role?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_url: string;
  total_orders: number;
  total_spent: number;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: User[];
  totalCounts: number;
}

export interface UserDetails {
  personal_info: {
    name: string;
    email: string;
    avatar_url: string;
    role: string;
    status: string;
    phone_code: string;
    phone_number: string;
  };
  summary: {
    total_orders: number;
    total_spend: number;
    total_wishlist_items: number;
    total_addresses: number;
  };
  address_details: Address[];
  cart_details: CartItem[];
  wishlist_details: Product[];
  coupons: Coupon[];
  order_details: Order[];
}

export interface GetUserDetailsForAdminResponse {
  success: boolean;
  message: string;
  data: UserDetails;
}

export interface UpdateUserProfileBody {
  avatar_url?: File;
}
