import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProductUnserviceablePincodes,
  addProductUnserviceablePincodes,
  replaceProductUnserviceablePincodes,
  removeProductUnserviceablePincode,
  removeMultipleProductUnserviceablePincodes,
  checkProductAvailability,
  type ProductPincodesResponse,
  type ProductAvailabilityResponse,
} from "./product-pincode.api";
import { queryClient } from "@/api/client";

export const productPincodesKeys = {
  all: ["product-pincodes"],
  detail: (slug: string) => ["product-pincodes", slug],
};

const useGetProductUnserviceablePincodes = (slug: string) => {
  return useQuery<ProductPincodesResponse>({
    queryKey: productPincodesKeys.detail(slug),
    queryFn: () => getProductUnserviceablePincodes(slug),
    enabled: slug !== "",
  });
};

const useAddProductUnserviceablePincodes = () => {
  return useMutation<
    ProductPincodesResponse,
    Error,
    { slug: string; pincodes: string[] }
  >({
    mutationFn: ({ slug, pincodes }) =>
      addProductUnserviceablePincodes(slug, pincodes),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({
        queryKey: productPincodesKeys.detail(slug),
      });
    },
  });
};

const useReplaceProductUnserviceablePincodes = () => {
  return useMutation<
    ProductPincodesResponse,
    Error,
    { slug: string; pincodes: string[] }
  >({
    mutationFn: ({ slug, pincodes }) =>
      replaceProductUnserviceablePincodes(slug, pincodes),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({
        queryKey: productPincodesKeys.detail(slug),
      });
    },
  });
};

const useRemoveProductUnserviceablePincode = () => {
  return useMutation<
    ProductPincodesResponse,
    Error,
    { slug: string; pincode: string }
  >({
    mutationFn: ({ slug, pincode }) =>
      removeProductUnserviceablePincode(slug, pincode),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({
        queryKey: productPincodesKeys.detail(slug),
      });
    },
  });
};

const useRemoveMultipleProductUnserviceablePincodes = () => {
  return useMutation<
    ProductPincodesResponse,
    Error,
    { slug: string; pincodes: string[] }
  >({
    mutationFn: ({ slug, pincodes }) =>
      removeMultipleProductUnserviceablePincodes(slug, pincodes),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({
        queryKey: productPincodesKeys.detail(slug),
      });
    },
  });
};

const useCheckProductAvailability = (
  slug: string,
  pincode: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<ProductAvailabilityResponse>({
    queryKey: ["product-availability", slug, pincode],
    queryFn: () => checkProductAvailability(slug, pincode),
    enabled: slug !== "" && pincode !== "" && options?.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export {
  useGetProductUnserviceablePincodes,
  useAddProductUnserviceablePincodes,
  useReplaceProductUnserviceablePincodes,
  useRemoveProductUnserviceablePincode,
  useRemoveMultipleProductUnserviceablePincodes,
  useCheckProductAvailability,
};
