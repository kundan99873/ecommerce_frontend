import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AddAddressApi,
  DeleteAddressApi,
  GetAddressesApi,
  UpdateAddressApi,
} from "./user.api";
import { queryClient } from "@/api/client";
import type { ApiResponse } from "@/api/api.types";
import type { AddAddressBody, GetUserAddressesResponse } from "./user.types";

const useAddAddress = () => {
  return useMutation<ApiResponse, Error, AddAddressBody>({
    mutationFn: AddAddressApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] }),
  });
};

const useGetAddresses = () => {
  return useQuery<GetUserAddressesResponse>({
    queryFn: GetAddressesApi,
    queryKey: ["user-addresses"],
  });
};

const useDeleteAddress = () => {
  return useMutation({
    mutationFn: DeleteAddressApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] }),
  });
};

const useUpdateAddress = () => {
  return useMutation<
    ApiResponse,
    Error,
    {
      id: string;
      data: AddAddressBody;
    }
  >({
    mutationFn: ({ id, data }) => UpdateAddressApi(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] }),
  });
};

export { useAddAddress, useGetAddresses, useDeleteAddress, useUpdateAddress };
