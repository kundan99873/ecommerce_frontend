import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategoryBySlug,
  updateCategory,
} from "./category.api";
import { queryClient } from "@/api/client";
import type { ApiResponse } from "@/api/api.types";
import type { GetCategoryResponse, UpdateCategoryBody } from "./category.types";

const useAddCategory = () => {
  return useMutation<ApiResponse, Error, FormData>({
    mutationFn: addCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["category"] }),
  });
};

const useGetCategory = () => {
  return useQuery<GetCategoryResponse>({
    queryFn: getCategory,
    queryKey: ["category"],
  });
};

const useGetCategoryBySlug = () => {
  return useQuery({
    queryFn: () => getCategoryBySlug,
    queryKey: ["category"],
  });
};

const useUpdateCategory = () => {
  return useMutation<ApiResponse, Error, UpdateCategoryBody>({
    mutationFn: updateCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["category"] }),
  });
};

const useDeleteCategory = () => {
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["category"] }),
  });
};

export {
  useAddCategory,
  useGetCategory,
  useGetCategoryBySlug,
  useUpdateCategory,
  useDeleteCategory,
};
