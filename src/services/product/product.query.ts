import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductBySlug, addProduct } from "./product.api";
import { queryClient } from "@/api/client";
// import type { ApiResponse } from "@/api/api.types";
import type { Product } from "./product.types";

export const productsKeys = {
  all: ["products"],
  detail: (slug: string) => ["products", slug],
};

const useProducts = () => {
  return useQuery({
    queryKey: productsKeys.all,
    queryFn: fetchProducts,
  });
};

const useProduct = (slug: string) => {
  return useQuery({
    queryKey: productsKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: slug !== "",
  });
};

const useAddProduct = () => {
  return useMutation<Product, Error, FormData>({
    mutationFn: addProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsKeys.all }),
  });
};

export { useProducts, useProduct, useAddProduct };
