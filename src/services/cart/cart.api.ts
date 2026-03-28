import { api } from "@/api/api";
import type { CartBody, CartCouponBody, CartResponse } from "./cart.types";
import type { ApiResponse } from "@/api/api.types";

const addToCart = async (body: CartBody): Promise<ApiResponse> => {
  const response = await api.post("/user/cart", body);
  return response.data;
};

const removeFromCart = async (slug: string): Promise<ApiResponse> => {
  const response = await api.post(`/user/cart/remove/${slug}`);
  return response.data;
};

const updateCartItem = async (body: CartBody): Promise<ApiResponse> => {
  const response = await api.patch("/user/cart", body);
  return response.data;
};

const applyCartCoupon = async (coupon_code: string): Promise<ApiResponse> => {
  const body: CartCouponBody = { coupon_code };
  const response = await api.post("/user/cart/coupon", body);
  return response.data;
};

const removeCartCoupon = async (): Promise<ApiResponse> => {
  const response = await api.delete("/user/cart/coupon");
  return response.data;
};

const clearCart = async (): Promise<ApiResponse> => {
  const response = await api.post("/user/cart/clear");
  return response.data;
};

const getAllCartCoupons = async (): Promise<ApiResponse> => {
  const response = await api.get("/user/cart/coupons/view-all");
  return response.data;
};

const getCartItems = async (): Promise<CartResponse> => {
  const response = await api.get("/user/cart");
  return response.data;
};

export {
  addToCart,
  removeFromCart,
  updateCartItem,
  applyCartCoupon,
  removeCartCoupon,
  clearCart,
  getAllCartCoupons,
  getCartItems,
};
