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


export { fetchProducts, fetchProductBySlug }