import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductBySlug,
  addProduct,
  updateProduct,
  deleteProductBySlug,
  fetchProductWithoutVariant,
  addReviewToProduct,
  getRecentlyViewedProducts,
  trackProductView,
  getTopRatedProducts,
} from "./product.api";
import { queryClient } from "@/api/client";
import type { ApiResponse } from "@/api/api.types";
import type { GetProductsQuery, ProductResponse } from "./product.types";
import { orderQueryKeys } from "../order/order.query";

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

const useGetProduct = (slug: string) => {
  return useQuery({
    queryKey: productsKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: slug !== "",
  });
};

const useGetProductWithoutVariant = (params?: GetProductsQuery) => {
  return useQuery({
    queryKey: ["products_without_variant", params],
    queryFn: () => fetchProductWithoutVariant(params),
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

const useInfiniteProducts = (params?: GetProductsQuery) => {
  const limit = params?.limit ?? 10;
  return useInfiniteQuery({
    queryKey: ["products", params],
    initialPageParam: 1,

    queryFn: ({ pageParam }) => fetchProducts({ ...params, page: pageParam }),

    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.totalCounts / limit);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,
  });
};

const useAddReviewToProduct = () => {
  return useMutation<
    ApiResponse,
    Error,
    { slug: string; rating: number; comment: string }
  >({
    mutationFn: ({ slug, rating, comment }) =>
      addReviewToProduct(slug, rating, comment),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
};

const useRecentlyViewedProducts = (enabled = true) => {
  return useQuery<ProductResponse>({
    queryKey: ["products", "recently-viewed"],
    queryFn: getRecentlyViewedProducts,
    enabled,
  });
};

const useTopRatedProducts = (enabled = true) => {
  return useQuery<ProductResponse>({
    queryKey: ["products", "top-rated"],
    queryFn: getTopRatedProducts,
    enabled,
  });
};

const useTrackProductView = () => {
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (slug) => trackProductView(slug),
  });
};

export {
  useProducts,
  useGetProduct,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  useInfiniteProducts,
  useGetProductWithoutVariant,
  useAddReviewToProduct,
  useRecentlyViewedProducts,
  useTopRatedProducts,
  useTrackProductView,
};
