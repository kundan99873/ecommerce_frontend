import { api } from "@/api/api";
import type { CouponBody, CouponResponse, GetCouponsQuery, UpdateCouponBody } from "./coupon.types";
import { cleanQueryParams } from "@/utils/utils";

const getCoupons = async (params?: GetCouponsQuery) => {
  const response = await api.get<CouponResponse>("/coupon", {
    params: cleanQueryParams(params ?? {}),
  });
  return response.data;
};

const addCoupon = async (data: CouponBody) => {
  const response = await api.post("/coupon", data);
  return response.data;
};

const updateCoupon = async ({ data, id }: { data: UpdateCouponBody; id: number }) => {
  const response = await api.patch(`/coupon/${id}`, data);
  return response.data;
};

const deleteCoupon = async (id: number) => {
  const response = await api.delete(`/coupon/${id}`);
  return response.data;
};

export { getCoupons, addCoupon, updateCoupon, deleteCoupon };
