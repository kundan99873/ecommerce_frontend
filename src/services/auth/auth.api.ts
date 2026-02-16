import { api } from "@/api/api";
import type { LoginBody, LoginResponse, UserResponse } from "./auth.types";

const registerUser = async (body: FormData) => {
  const response = await api.post("/user/register", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const loginUser = async (body: LoginBody) => {
  const response = await api.post<LoginResponse>("/user/login", body);
  return response.data;
};

const logoutUser = async () => {
  const response = await api.post("/user/logout");
  return response.data;
};

const googleLogin = async (token: string) => {
  const response = await api.post(`/user/google-login`, {
    token,
  });
  return response.data;
};

const getLoggedInUserDetails = async () => {
  const response = await api.post<UserResponse>(`/user/me`);
  return response.data;
};

export {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  getLoggedInUserDetails,
};
