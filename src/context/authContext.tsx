import React, { createContext, useContext } from "react";
import {
  useLoggedInUser,
  useUserLogin,
  useUserLogout,
} from "@/services/auth/auth.query";
import type { LoginResponse, User } from "@/services/auth/auth.types";
import type { ApiResponse } from "@/api/api.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<ApiResponse>;
  loginLoading: boolean;
  logoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: user, isError, isLoading } = useLoggedInUser();
  const loginMutation = useUserLogin();
  const logoutMutation = useUserLogout();

  const value: AuthContextType = {
    user: user?.data ?? null,
    isAuthenticated: !!user && !isError,
    isLoading,
    login: (email, password) => loginMutation.mutateAsync({ email, password }),
    logout: () => logoutMutation.mutateAsync(),
    loginLoading: loginMutation.isPending,
    logoutLoading: logoutMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
