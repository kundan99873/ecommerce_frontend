import { api } from "@/api/api";
import type { GetCategoryResponse, UpdateCategoryBody } from "./category.types";
import type { ApiResponse } from "@/api/api.types";

const addCategory = async (body: FormData) => {
  const response = await api.post("/category", body, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

const getCategory = async () => {
  const response = await api.get<GetCategoryResponse>("/category");
  return response.data;
};

const updateCategory = async ({ slug, body }: UpdateCategoryBody) => {
  const response = await api.patch<ApiResponse>(`/category/${slug}`, body);
  return response.data;
};

const getCategoryBySlug = async (slug: string) => {
  const response = await api.get<ApiResponse>(`/category/${slug}`);
  return response.data;
};

const deleteCategory = async (slug: string) => {
  const response = await api.delete<ApiResponse>(`/category/${slug}`);
  return response.data;
};

export {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
};
