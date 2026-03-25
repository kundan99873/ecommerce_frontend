import { api } from "@/api/api";
import type { AddAddressBody, GetAllUsersParam, GetAllUsersResponse, GetUserDetailsForAdminResponse } from "./user.types";

const AddAddressApi = async (data: AddAddressBody) => {
  const response = await api.post("/user/address", data);
  return response.data;
};

const GetAddressesApi = async () => {
  const response = await api.get("/user/address");
  return response.data;
};

const DeleteAddressApi = async (id: string) => {
  const response = await api.delete(`/user/address/${id}`);
  return response.data;
};

const UpdateAddressApi = async (id: string, data: AddAddressBody) => {
  const response = await api.patch(`/user/address/${id}`, data);
  return response.data;
};

const getAllUsers = async (params: GetAllUsersParam): Promise<GetAllUsersResponse> => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

const getUserByUserIdForAdmin = async (id: number): Promise<GetUserDetailsForAdminResponse> => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};


export { AddAddressApi, GetAddressesApi, DeleteAddressApi, UpdateAddressApi, getAllUsers, getUserByUserIdForAdmin };
