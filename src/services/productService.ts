import { products as initialProducts, type Product, categories } from "@/data/products";

export interface AdminProduct extends Product {
  active: boolean;
  deleted: boolean;
}

let productStore: AdminProduct[] = initialProducts.map((p) => ({
  ...p,
  active: true,
  deleted: false,
}));

export const productService = {
  getAll: async (): Promise<AdminProduct[]> => {
    await new Promise((r) => setTimeout(r, 200));
    return productStore.filter((p) => !p.deleted);
  },

  create: async (data: Partial<Product> & { active: boolean }): Promise<AdminProduct> => {
    await new Promise((r) => setTimeout(r, 300));
    const newProduct: AdminProduct = {
      ...data,
      id: Date.now(),
      rating: 0,
      reviews: 0,
      active: data.active ?? true,
      deleted: false,
      name: data.name || "",
      price: data.price || 0,
      image: data.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=750&fit=crop",
      category: data.category || "",
      brand: data.brand || "",
      description: data.description || "",
      inStock: data.inStock ?? true,
    };
    productStore = [newProduct, ...productStore];
    return newProduct;
  },

  update: async (id: number, data: Partial<AdminProduct>): Promise<AdminProduct> => {
    await new Promise((r) => setTimeout(r, 300));
    productStore = productStore.map((p) => (p.id === id ? { ...p, ...data } : p));
    return productStore.find((p) => p.id === id)!;
  },

  delete: async (id: number): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    productStore = productStore.map((p) => (p.id === id ? { ...p, deleted: true } : p));
  },

  bulkDelete: async (ids: number[]): Promise<void> => {
    await new Promise((r) => setTimeout(r, 300));
    const idSet = new Set(ids);
    productStore = productStore.map((p) => (idSet.has(p.id) ? { ...p, deleted: true } : p));
  },
};

export { categories };
