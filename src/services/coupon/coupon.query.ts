import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "./coupon.api";
import type { CouponBody, GetCouponsQuery, UpdateCouponBody } from "./coupon.types";
import { queryClient } from "@/api/client";
import type { ApiResponse } from "@/api/api.types";

const useGetCoupons = (params?: GetCouponsQuery) => {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => getCoupons(params),
  });
};

const useAddCoupon = () => {
  return useMutation<ApiResponse, Error, CouponBody>({
    mutationFn: addCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

const useUpdateCoupon = () => {
  return useMutation<ApiResponse, Error, { data: UpdateCouponBody; id: number }>({
    mutationFn: ({ data, id }) => updateCoupon({ data, id }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

const useDeleteCoupon = () => {
  return useMutation<ApiResponse, Error, number>({
    mutationFn: (id) => deleteCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export { useGetCoupons, useAddCoupon, useUpdateCoupon, useDeleteCoupon };
