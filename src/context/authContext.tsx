import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "@/hooks/useToast";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  changePassword: (current: string, newPass: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "lumiere_token";
const USER_KEY = "lumiere_user";

const MOCK_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "kundan@gmail.com",
    password: "Kundan@123",
    user: {
      id: "usr_1",
      name: "Kundan Chaudhary",
      email: "kundan@gmail.com",
      phone: "+91 8779253883",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      addresses: [
        { id: "addr_1", label: "Home", name: "Kundan Chaudhary", street: "123 Main St", city: "Mumbai", state: "Maharashtra", zip: "400037", country: "India", isDefault: true },
      ],
      createdAt: "2024-06-15",
    },
  },
];

function generateToken(): string {
  return `jwt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const saved = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (token && saved) {
      try {
        setUser(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const persistSession = (u: User, remember: boolean) => {
    const token = generateToken();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(u));
    // Clear the other storage
    const other = remember ? sessionStorage : localStorage;
    other.removeItem(TOKEN_KEY);
    other.removeItem(USER_KEY);
  };

  const login = useCallback(async (email: string, password: string, remember = false): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate network

    // Check mock users & registered users
    const allUsers = [...MOCK_USERS];
    const registered = JSON.parse(localStorage.getItem("lumiere_registered") || "[]") as typeof MOCK_USERS;
    allUsers.push(...registered);

    const found = allUsers.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found.user);
      persistSession(found.user, remember);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const allUsers = [...MOCK_USERS];
    const registered = JSON.parse(localStorage.getItem("lumiere_registered") || "[]") as typeof MOCK_USERS;
    allUsers.push(...registered);

    if (allUsers.some((u) => u.email === email)) {
      setIsLoading(false);
      return false;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      addresses: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    registered.push({ email, password, user: newUser });
    localStorage.setItem("lumiere_registered", JSON.stringify(registered));
    setUser(newUser);
    persistSession(newUser, true);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    toast({ title: "Logged out", description: "You have been signed out." });
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Update in both storages
      const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
    toast({ title: "Profile updated" });
  }, []);

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newAddr = { ...address, id: `addr_${Date.now()}` };
      const addresses = address.isDefault
        ? prev.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
        : [...prev.addresses, newAddr];
      const updated = { ...prev, addresses };
      const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateAddress = useCallback((id: string, address: Partial<Address>) => {
    setUser((prev) => {
      if (!prev) return prev;
      let addresses = prev.addresses.map((a) => (a.id === id ? { ...a, ...address } : a));
      if (address.isDefault) addresses = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
      const updated = { ...prev, addresses };
      const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) };
      const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const changePassword = useCallback(async (_current: string, _newPass: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500));
    toast({ title: "Password changed", description: "Your password has been updated." });
    return true;
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    toast({ title: "Reset link sent", description: `A password reset link has been sent to ${email}.` });
    return true;
  }, []);

  const resetPassword = useCallback(async (_token: string, _newPass: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    toast({ title: "Password reset", description: "Your password has been reset. Please log in." });
    return true;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        changePassword,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
