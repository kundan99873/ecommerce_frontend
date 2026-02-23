import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addHeroSlides,
  deleteHeroSlides,
  getHeroSlides,
  updateHeroSlides,
} from "./heroSlides.api";
import { queryClient } from "@/api/client";
import type { ApiResponse } from "@/api/api.types";
import type { GetHeroSlideQuery, GetHeroSlideResponse, UpdateHeroSlideBody } from "./heroSlides.types";

const useAddHeroSlide = () => {
  return useMutation<ApiResponse, Error, FormData>({
    mutationFn: addHeroSlides,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["heroSlides"] }),
  });
};

const useGetHeroSlides = (params?: GetHeroSlideQuery) => {
  return useQuery<GetHeroSlideResponse>({
    queryFn:  () => getHeroSlides(params),
    queryKey: ["heroSlides", params],
  });
};

const useUpdateHeroSlide = () => {
  return useMutation<ApiResponse, Error, UpdateHeroSlideBody>({
    mutationFn: updateHeroSlides,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["heroSlides"] }),
  });
};

const useDeleteHeroSlide = () => {
  return useMutation({
    mutationFn: deleteHeroSlides,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["heroSlides"] }),
  });
};

export {
  useAddHeroSlide,
  useGetHeroSlides,
  useUpdateHeroSlide,
  useDeleteHeroSlide,
};
