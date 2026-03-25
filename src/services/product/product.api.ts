import { api } from "@/api/api";
import type {
  GetProductsQuery,
  ProductReview,
  ProductReviewsResponse,
  ProductResponse,
  ProductWithoutVariantResponse,
  ProductWithSlugResponse,
} from "./product.types";
import type { ApiResponse } from "@/api/api.types";
import { cleanQueryParams } from "@/utils/utils";

const fetchProducts = async (
  params?: GetProductsQuery,
): Promise<ProductResponse> => {
  const response = await api.get(`/product`, {
    params: cleanQueryParams(params ?? {}),
  });
  return response.data;
};

const fetchProductBySlug = async (
  slug: string,
): Promise<ProductWithSlugResponse> => {
  const response = await api.get(`/product/${slug}`);
  return response.data;
};

const fetchProductWithoutVariant = async (
  params?: GetProductsQuery,
): Promise<ProductWithoutVariantResponse> => {
  const response = await api.get(`/product/without-variants`, {
    params: cleanQueryParams(params ?? {}),
  });
  return response.data;
};

const addProduct = async (data: FormData): Promise<ApiResponse> => {
  const response = await api.post(`/product/add`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const updateProduct = async ({
  data,
  slug,
}: {
  data: FormData;
  slug: string;
}): Promise<ApiResponse> => {
  const response = await api.patch(`/product/${slug}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const deleteProductBySlug = async (slug: string): Promise<ApiResponse> => {
  const response = await api.delete(`/product/${slug}`);
  return response.data;
};

const addReviewToProduct = async (
  slug: string,
  rating: number,
  comment: string,
): Promise<ApiResponse> => {
  const response = await api.post(`/product/review/${slug}`, {
    rating,
    comment,
  });
  return response.data;
};

const getRecentlyViewedProducts = async (): Promise<ProductResponse> => {
  const response = await api.get(`/product/recently-visited`);
  return response.data;
};

const trackProductView = async (slug: string): Promise<ApiResponse> => {
  const response = await api.post(`/product/recently-visited/${slug}`);
  return response.data;
};

const getTopRatedProducts = async (): Promise<ProductResponse> => {
  const response = await api.get(`/product/top-rated`);
  return response.data;
};

const getProductReviews = async (
  slug: string,
  page = 1,
  limit = 10,
): Promise<ProductReviewsResponse> => {
  const response = await api.get(`/product/${slug}/reviews`, {
    params: { page, limit },
  });

  const payload = response.data;
  const reviews: ProductReview[] = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.data?.reviews)
      ? payload.data.reviews
      : Array.isArray(payload?.reviews)
        ? payload.reviews
        : [];

  const totalCounts =
    payload?.totalCounts ??
    payload?.data?.total ??
    payload?.data?.total_reviews ??
    payload?.data?.totalCounts ??
    payload?.pagination?.total ??
    payload?.data?.pagination?.total;

  const averageRating =
    payload?.average_rating ?? payload?.data?.average_rating ?? 0;

  const totalReviews =
    payload?.total_reviews ?? payload?.data?.total_reviews ?? totalCounts;

  const ratingBreakdown =
    payload?.rating_breakdown ?? payload?.data?.rating_breakdown ?? {};

  return {
    success: payload?.success ?? true,
    message: payload?.message ?? "",
    data: reviews,
    totalCounts,
    totalReviews,
    averageRating,
    ratingBreakdown,
  };
};

const getRecentSearches = async (): Promise<string[]> => {
  const response = await api.get(`/product/search/recent`);
  return response.data;
}

export {
  fetchProducts,
  fetchProductBySlug,
  fetchProductWithoutVariant,
  addProduct,
  updateProduct,
  deleteProductBySlug,
  addReviewToProduct,
  getRecentlyViewedProducts,
  trackProductView,
  getTopRatedProducts,
  getProductReviews,
  getRecentSearches,
};
