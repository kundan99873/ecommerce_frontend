import { api } from "@/api/api";
import type {
  CouponBody,
  CouponResponse,
  GetCouponsQuery,
  UpdateCouponBody,
} from "./coupon.types";
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

const updateCoupon = async ({
  data,
  code,
}: {
  data: UpdateCouponBody;
  code: string;
}) => {
  const response = await api.patch(`/coupon/${encodeURIComponent(code)}`, data);
  return response.data;
};

const deleteCoupon = async (code: string) => {
  const response = await api.delete(`/coupon/${encodeURIComponent(code)}`);
  return response.data;
};

export { getCoupons, addCoupon, updateCoupon, deleteCoupon };
