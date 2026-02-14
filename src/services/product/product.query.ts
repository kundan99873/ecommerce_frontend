import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductBySlug } from "./product.api";

export const productsKeys = {
  all: ["products"],
  detail: (slug: string) => ["products", slug],
};

export const useProducts = () => {
  return useQuery({
    queryKey: productsKeys.all,
    queryFn: fetchProducts,
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: productsKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: slug !== "",
  });
};

