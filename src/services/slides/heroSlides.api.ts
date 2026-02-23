import { api } from "@/api/api";
import type { ApiResponse } from "@/api/api.types";
import type { GetHeroSlideQuery, GetHeroSlideResponse, UpdateHeroSlideBody } from "./heroSlides.types";
import { cleanQueryParams } from "@/utils/utils";

const addHeroSlides = async (body: FormData) => {
  const response = await api.post("/hero-slides", body, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

const getHeroSlides = async (params?: GetHeroSlideQuery) => {
  const response = await api.get<GetHeroSlideResponse>("/hero-slides", { params: cleanQueryParams(params ?? {}) });
  return response.data;
};

const updateHeroSlides = async ({ id, body }: UpdateHeroSlideBody) => {
  const response = await api.patch<ApiResponse>(`/hero-slides/${id}`, body, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

const getHeroSlidesBySlug = async (slug: string) => {
  const response = await api.get<ApiResponse>(`/hero-slides/${slug}`);
  return response.data;
};

const deleteHeroSlides = async (id: number) => {
  const response = await api.delete<ApiResponse>(`/hero-slides/${id}`);
  return response.data;
};

export {
  getHeroSlides,
  addHeroSlides,
  updateHeroSlides,
  deleteHeroSlides,
  getHeroSlidesBySlug,
};
