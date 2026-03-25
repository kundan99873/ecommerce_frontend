import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AddAddressApi,
  DeleteAddressApi,
  GetAddressesApi,
  getAllUsers,
  getUserByUserIdForAdmin,
  UpdateAddressApi,
} from "./user.api";
import { queryClient } from "@/api/client";
import type { ApiResponse } from "@/api/api.types";
import type {
  AddAddressBody,
  GetAllUsersParam,
  GetAllUsersResponse,
  GetUserDetailsForAdminResponse,
  GetUserAddressesResponse,
} from "./user.types";

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

const useGetAllUsers = (params?: GetAllUsersParam) => {
  return useQuery<GetAllUsersResponse>({
    queryKey: ["all-users", params],
    queryFn: () => getAllUsers(params ?? {}),
  });
};

const useGetUserByUserIdForAdmin = (id: number | null) => {
  return useQuery<GetUserDetailsForAdminResponse>({
    queryKey: ["admin-user-details", id],
    queryFn: () => getUserByUserIdForAdmin(id!),
    enabled: !!id,
  });
};

export {
  useAddAddress,
  useGetAddresses,
  useDeleteAddress,
  useUpdateAddress,
  useGetAllUsers,
  useGetUserByUserIdForAdmin,
};
