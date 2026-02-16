import { mockCategories, type Category } from "@/data/adminData";

let categoryStore: Category[] = [...mockCategories];

export interface CategoryFormData {
  name: string;
  image?: string;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    await new Promise((r) => setTimeout(r, 200));
    return [...categoryStore];
  },

  create: async (data: CategoryFormData): Promise<Category> => {
    await new Promise((r) => setTimeout(r, 300));
    const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const cat: Category = {
      id: `cat_${Date.now()}`,
      name: data.name,
      slug,
      productCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      image: data.image,
    };
    categoryStore = [cat, ...categoryStore];
    return cat;
  },

  update: async (id: string, data: CategoryFormData): Promise<Category> => {
    await new Promise((r) => setTimeout(r, 300));
    const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    categoryStore = categoryStore.map((c) =>
      c.id === id ? { ...c, name: data.name, slug, image: data.image } : c
    );
    return categoryStore.find((c) => c.id === id)!;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    const cat = categoryStore.find((c) => c.id === id);
    if (cat && cat.productCount > 0) throw new Error(`Cannot delete: ${cat.productCount} products linked`);
    categoryStore = categoryStore.filter((c) => c.id !== id);
  },
};
