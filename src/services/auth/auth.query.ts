import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  getLoggedInUserDetails,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyResetToken,
} from "./auth.api";
import { queryClient } from "@/api/client";
import type { ApiResponse } from "@/api/api.types";
import type { LoginBody, LoginResponse, UserResponse } from "./auth.types";

const useUserLogin = () => {
  return useMutation<LoginResponse, Error, LoginBody>({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({
        queryKey: ["products", "recently-viewed"],
      });
    },
  });
};

const useGoogleLogin = () => {
  return useMutation({
    mutationFn: (credential: string) => googleLogin(credential),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({
        queryKey: ["products", "recently-viewed"],
      });
    },
  });
};

const useUserLogout = () => {
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["wishlist"] });
      queryClient.removeQueries({
        queryKey: ["products", "recently-viewed"],
      });
      queryClient.removeQueries({ queryKey: ["products", "search", "recent"] });
      queryClient.removeQueries({ queryKey: ["cart_coupons"] });
    },
  });
};

const useUserRegister = () =>
  useMutation({
    mutationFn: (data: FormData) => registerUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({
        queryKey: ["products", "recently-viewed"],
      });
    },
  });

const useLoggedInUser = () =>
  useQuery<UserResponse>({
    queryFn: () => getLoggedInUserDetails(),
    queryKey: ["me"],
  });

const useChangePassword = () => {
  return useMutation<
    ApiResponse,
    Error,
    { current_password: string; new_password: string }
  >({
    mutationFn: (data) => changePassword(data),
  });
};

const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
};

const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { token: string; new_password: string }) =>
      resetPassword(data),
  });
};

const useVerifyResetToken = () => {
  return useMutation({
    mutationFn: (data: { token: string }) => verifyResetToken(data),
  });
};

export {
  useGoogleLogin,
  useUserRegister,
  useLoggedInUser,
  useUserLogin,
  useUserLogout,
  useChangePassword,
  useForgotPassword,
  useResetPassword,
  useVerifyResetToken,
};
