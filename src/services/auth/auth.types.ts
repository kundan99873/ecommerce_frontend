export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface User {
  name: string;
  email: string;
  avatar_url?: string;
  role: "customer" | "admin";  
  created_at: string;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data?: User;
}
