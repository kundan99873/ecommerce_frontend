import { api } from "@/api/api";
import type { CouponBody, GetCouponsQuery } from "./coupon.types";
import { cleanQueryParams } from "@/utils/utils";

const getCoupons = async (params?: GetCouponsQuery) => {
  const response = await api.get("/coupon", {
    params: cleanQueryParams(params ?? {}),
  });
  return response.data;
};

const addCoupon = async (data: CouponBody) => {
  const response = await api.post("/coupon", data);
  return response.data;
};

const updateCoupon = async ({ data, id }: { data: CouponBody; id: string }) => {
  const response = await api.patch(`/coupon/${id}`, data);
  return response.data;
};

const deleteCoupon = async (id: string) => {
  const response = await api.delete(`/coupon/${id}`);
  return response.data;
};

export { getCoupons, addCoupon, updateCoupon, deleteCoupon };
