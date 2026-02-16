import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getLoggedInUserDetails,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
} from "./auth.api";
import { queryClient } from "@/api/client";
import type { LoginBody, LoginResponse, UserResponse } from "./auth.types";

const useUserLogin = () => {
  return useMutation<LoginResponse, Error, LoginBody>({
    mutationFn: loginUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
};

const useGoogleLogin = () => {
  return useMutation({
    mutationFn: (credential: string) => googleLogin(credential),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
};

const useUserLogout = () => {
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
};

const useUserRegister = () =>
  useMutation({
    mutationFn: (data: FormData) => registerUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

const useLoggedInUser = () =>
  useQuery<UserResponse>({
    queryFn: () => getLoggedInUserDetails(),
    queryKey: ["me"],
  });

export {
  useGoogleLogin,
  useUserRegister,
  useLoggedInUser,
  useUserLogin,
  useUserLogout,
};
