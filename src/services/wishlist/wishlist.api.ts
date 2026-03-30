import { api } from "@/api/api";

const getWishlistApi = async () => {
  const response = await api.get(`/user/wishlist`);
  return response.data;
};

const addToWishlistApi = async (slug: string) => {
  const response = await api.post(`/user/wishlist/${slug}`);
  return response.data;
};

const removeFromWishlistApi = async (slug: string) => {
  const response = await api.delete(`/user/wishlist/${slug}`);
  return response.data;
};

export { getWishlistApi, addToWishlistApi, removeFromWishlistApi };
