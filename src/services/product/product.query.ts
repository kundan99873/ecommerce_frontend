import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductBySlug,
  addProduct,
  updateProduct,
  deleteProductBySlug,
} from "./product.api";
import { queryClient } from "@/api/client";
import type { ApiResponse } from "@/api/api.types";
import type { GetProductsQuery, ProductResponse } from "./product.types";

export const productsKeys = {
  all: ["products"],
  detail: (slug: string) => ["products", slug],
};

const useProducts = (params?: GetProductsQuery) => {
  return useQuery<ProductResponse>({
    queryFn: () => fetchProducts(params),
    queryKey: [...productsKeys.all, params],
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
  return useMutation<ApiResponse, Error, FormData>({
    mutationFn: addProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsKeys.all }),
  });
};

const useUpdateProduct = () => {
  return useMutation<ApiResponse, Error, { data: FormData; slug: string }>({
    mutationFn: ({ data, slug }) => updateProduct({ data, slug }),
    onSuccess: (_, { slug }) =>
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(slug) }),
  });
};

const useDeleteProduct = () => {
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (slug) => deleteProductBySlug(slug),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsKeys.all }),
  });
};

export {
  useProducts,
  useProduct,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
};
