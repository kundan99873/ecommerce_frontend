import { api } from "@/api/api";
import type {
  LoggedInDevicesResponse,
  LoginBody,
  LoginResponse,
  UserResponse,
} from "./auth.types";

const registerUser = async (body: FormData) => {
  const response = await api.post("/auth/register", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const loginUser = async (body: LoginBody) => {
  const response = await api.post<LoginResponse>("/auth/login", body);
  return response.data;
};

const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

const logoutSessionByDevice = async (deviceId: string) => {
  const response = await api.post(`/auth/sessions/device/${deviceId}`);
  return response.data;
};

const logoutOtherSessions = async () => {
  const response = await api.post("/auth/sessions/logout-others");
  return response.data;
};

const googleLogin = async (token: string) => {
  const response = await api.post(`/auth/google-login`, {
    token,
  });
  return response.data;
};

const getLoggedInUserDetails = async () => {
  const response = await api.post<UserResponse>(`/auth/me`);
  return response.data;
};

const getLoggedInDevices = async () => {
  const response = await api.get<LoggedInDevicesResponse>(
    `/auth/logged-in-devices`,
  );
  return response.data;
};

const changePassword = async (data: {
  current_password: string;
  new_password: string;
}) => {
  const response = await api.post(`/auth/change-password`, data);
  return response.data;
};

const forgotPassword = async (email: string) => {
  const response = await api.post(`/auth/forgot-password`, { email });
  return response.data;
};

const resetPassword = async (data: { token: string; new_password: string }) => {
  const response = await api.patch(`/auth/reset-password`, data);
  return response.data;
};

const verifyResetToken = async (data: { token: string }) => {
  const response = await api.post(`/auth/reset-password`, data);
  return response.data;
};

export {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  logoutSessionByDevice,
  logoutOtherSessions,
  getLoggedInUserDetails,
  getLoggedInDevices,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyResetToken,
};
