import React, { createContext, useContext } from "react";
import {
  useForgotPassword,
  useLoggedInUser,
  useResetPassword,
  useUserLogin,
  useUserLogout,
} from "@/services/auth/auth.query";
import type { LoginResponse, User } from "@/services/auth/auth.types";
import type { ApiResponse } from "@/api/api.types";
import PageLoader from "@/components/common/pageLoader";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<ApiResponse>;
  forgotPassword: (email: string) => Promise<ApiResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<ApiResponse>;
  loginLoading: boolean;
  logoutLoading: boolean;
  forgotPasswordLoading: boolean;
  resetPasswordLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: user, isError, isLoading, isFetching } = useLoggedInUser();
  const loginMutation = useUserLogin();
  const logoutMutation = useUserLogout();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const value: AuthContextType = {
    user: user?.data ?? null,
    isAuthenticated: !!user && !isError,
    isLoading,
    login: (email, password) => loginMutation.mutateAsync({ email, password }),
    logout: () => logoutMutation.mutateAsync(),
    forgotPassword: (email) => forgotPasswordMutation.mutateAsync(email),
    resetPassword: (token, newPassword) =>
      resetPasswordMutation.mutateAsync({ token, new_password: newPassword }),
    loginLoading: loginMutation.isPending,
    logoutLoading: logoutMutation.isPending,
    forgotPasswordLoading: forgotPasswordMutation.isPending,
    resetPasswordLoading: resetPasswordMutation.isPending,
  };

  if (isLoading || isFetching) return <PageLoader />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
