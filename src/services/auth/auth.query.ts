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
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({
        queryKey: ["products", "recently-viewed"],
      });
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

export {
  useGoogleLogin,
  useUserRegister,
  useLoggedInUser,
  useUserLogin,
  useUserLogout,
};
