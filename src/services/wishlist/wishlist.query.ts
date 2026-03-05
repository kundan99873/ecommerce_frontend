import { queryClient } from "@/api/client";
import {
  addToWishlistApi,
  getWishlistApi,
  removeFromWishlistApi,
} from "./wishlist.api";
import type { ApiResponse } from "@/api/api.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ProductResponse } from "../product/product.types";

export const wishlistKeys = {
  all: ["wishlist"],
};

const useGetWishlist = () => {
  return useQuery<ProductResponse>({
    queryKey: wishlistKeys.all,
    queryFn: getWishlistApi,
  });
};

const useAddToWishlist = () => {
  return useMutation<ApiResponse, Error, string>({
    mutationFn: addToWishlistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

const useRemoveFromWishlist = () => {
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (slug: string) => removeFromWishlistApi(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

export { useGetWishlist, useAddToWishlist, useRemoveFromWishlist };
