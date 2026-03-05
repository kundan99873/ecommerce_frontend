import { api } from "@/api/api";

const getWishlistApi = async () => {
  const response = await api.get(`/users/wishlist`);
  return response.data;
};

const addToWishlistApi = async (slug: string) => {
  const response = await api.post(`/users/wishlist/${slug}`);
  return response.data;
};

const removeFromWishlistApi = async (slug: string) => {
  const response = await api.delete(`/users/wishlist/${slug}`);
  return response.data;
};

export { getWishlistApi, addToWishlistApi, removeFromWishlistApi };
