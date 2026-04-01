import { api } from "@/api/api";
import type { ApiResponse } from "@/api/api.types";

type ApiDataResponse<T> = ApiResponse & { data: T };

interface ProductPincodesResponse {
  slug: string;
  unserviceable_pincodes: string[];
}

const getProductUnserviceablePincodes = async (
  slug: string,
): Promise<ApiDataResponse<ProductPincodesResponse>> => {
  const response = await api.get(`/product/${slug}/pincodes`);
  return response.data;
};

const addProductUnserviceablePincodes = async (
  slug: string,
  pincodes: string[],
): Promise<ApiDataResponse<ProductPincodesResponse>> => {
  const response = await api.post(`/product/${slug}/pincodes`, {
    pincodes,
  });
  return response.data;
};

const replaceProductUnserviceablePincodes = async (
  slug: string,
  pincodes: string[],
): Promise<ApiDataResponse<ProductPincodesResponse>> => {
  const response = await api.put(`/product/${slug}/pincodes`, {
    pincodes,
  });
  return response.data;
};

const removeProductUnserviceablePincode = async (
  slug: string,
  pincode: string,
): Promise<ApiDataResponse<ProductPincodesResponse>> => {
  const response = await api.delete(`/product/${slug}/pincodes/${pincode}`);
  return response.data;
};

const removeMultipleProductUnserviceablePincodes = async (
  slug: string,
  pincodes: string[],
): Promise<ApiDataResponse<ProductPincodesResponse>> => {
  const response = await api.post(`/product/${slug}/pincodes/delete/multiple`, {
    pincodes,
  });
  return response.data;
};

interface ProductAvailabilityResponse {
  slug: string;
  pincode: string;
  is_available: boolean;
}

const checkProductAvailability = async (
  slug: string,
  pincode: string,
): Promise<ApiDataResponse<ProductAvailabilityResponse>> => {
  const response = await api.get(`/product/${slug}/availability`, {
    params: { pincode },
  });
  return response.data;
};

export {
  getProductUnserviceablePincodes,
  addProductUnserviceablePincodes,
  replaceProductUnserviceablePincodes,
  removeProductUnserviceablePincode,
  removeMultipleProductUnserviceablePincodes,
  checkProductAvailability,
  type ProductPincodesResponse,
  type ProductAvailabilityResponse,
};
