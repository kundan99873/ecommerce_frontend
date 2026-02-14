import { api } from "@/api/api";
// import type { RegisterBody } from "./auth.types";

const registerUser = async (body: FormData) => {
  const response = await api.post("/user/register", body, {
    headers: { 'Content-Type': "multipart/form-data"}
  });
  return response.data;
};

const googleLogin = async (token: string) => {
  const response = await api.post(`/user/google-login`, {
    token,
  });
  return response.data;
};

export { registerUser, googleLogin };
