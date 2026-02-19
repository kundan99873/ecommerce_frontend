import { api } from "@/api/api";
import type { Product, ProductResponse } from "./product.types";
import type { ApiResponse } from "@/api/api.types";

const fetchProducts = async (): Promise<ProductResponse> => {
  const response = await api.get(`/product`);
  return response.data.data;
};

const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const response = await api.get(`/products/${slug}`);
  return response.data.data;
};

const addProduct = async (data: FormData): Promise<ApiResponse> => {
  const response = await api.post(`/product/add`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}


export { fetchProducts, fetchProductBySlug, addProduct };