import { api } from "@/api/api";
import type {
  GetProductsQuery,
  ProductReview,
  ProductReviewsResponse,
  ProductResponse,
  ProductWithoutVariantResponse,
  ProductWithSlugResponse,
  searchApiResponse,
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

const getSimilarProducts = async (
  slug: string,
  limit = 6,
): Promise<ProductResponse> => {
  const response = await api.get(`/product/${slug}/similar`, {
    params: { limit },
  });
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
  const data = payload?.data;

  const reviews: ProductReview[] = Array.isArray(data?.reviews)
    ? data.reviews
    : [];

  const totalCounts =
    typeof data?.total === "number" ? data.total : reviews.length;

  const averageRating =
    typeof data?.average_rating === "number" ? data.average_rating : 0;

  const totalReviews =
    typeof data?.total_reviews === "number" ? data.total_reviews : totalCounts;

  const ratingBreakdown =
    data?.rating_breakdown && typeof data.rating_breakdown === "object"
      ? data.rating_breakdown
      : {};

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

const getRecentSearches = async (): Promise<searchApiResponse> => {
  const response = await api.get(`/product/search/recent`);
  return response.data;
};

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
  getSimilarProducts,
  getProductReviews,
  getRecentSearches,
};
