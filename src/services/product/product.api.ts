import { api } from "@/api/api";
import type { Product } from "./product.types";

const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get(`/products`);
  return response.data.data;
};

const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const response = await api.get(`/products/${slug}`);
  return response.data.data;
};

const addProduct = async (data: FormData): Promise<Product> => {
  const response = await api.post(`/products`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}


export { fetchProducts, fetchProductBySlug, addProduct };