export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface LoginBody {
  email: string;
  password: string;
  force_logout_device_id?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: DeviceSession[];
}

export interface DeviceSession {
  id: string;
  device_id: string;
  device_name?: string;
  user_agent?: string;
  ip_address?: string;
  created_at?: string;
  last_used_at?: string;
  is_current?: boolean;
}

export interface LoggedInDevicesResponse {
  success: boolean;
  message?: string;
  data: DeviceSession[];
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
