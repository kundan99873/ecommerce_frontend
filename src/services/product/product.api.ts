import axios from "axios";
import type { Product } from "./product.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/api/products`);
  return response.data.data;
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const response = await axios.get(`${API_URL}/api/products/${slug}`);
  return response.data.data;
};
