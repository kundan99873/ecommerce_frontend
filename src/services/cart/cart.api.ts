import { api } from "@/api/api";
import type { CartBody, CartCouponBody, CartResponse } from "./cart.types";
import type { ApiResponse } from "@/api/api.types";

const addToCart = async (body: CartBody): Promise<ApiResponse> => {
  const response = await api.post("/users/cart", body);
  return response.data;
};

const removeFromCart = async (slug: string): Promise<ApiResponse> => {
  const response = await api.post(`/users/cart/remove/${slug}`);
  return response.data;
};

const updateCartItem = async (body: CartBody): Promise<ApiResponse> => {
  const response = await api.patch("/users/cart", body);
  return response.data;
};

const applyCartCoupon = async (coupon_id: number): Promise<ApiResponse> => {
  const body: CartCouponBody = { coupon_id };
  const response = await api.patch("/users/cart", body);
  return response.data;
};

const removeCartCoupon = async (): Promise<ApiResponse> => {
  const body: CartCouponBody = { coupon_id: null };
  const response = await api.patch("/users/cart", body);
  return response.data;
};

const clearCart = async (): Promise<ApiResponse> => {
  const response = await api.post("/users/cart/clear");
  return response.data;
};

const getCartItems = async (): Promise<CartResponse> => {
  const response = await api.get("/users/cart");
  return response.data;
};

export {
  addToCart,
  removeFromCart,
  updateCartItem,
  applyCartCoupon,
  removeCartCoupon,
  clearCart,
  getCartItems,
};
