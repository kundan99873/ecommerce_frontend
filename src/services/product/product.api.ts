import { api } from "@/api/api";
import type {
  GetProductsQuery,
  Product,
  ProductResponse,
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

const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const response = await api.get(`/product/${slug}`);
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

export {
  fetchProducts,
  fetchProductBySlug,
  addProduct,
  updateProduct,
  deleteProductBySlug,
};
