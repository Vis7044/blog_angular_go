"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { AxiosError } from "axios";
import apiClient from "@/utils/axiosInstance";
import OverlaySpinner from "@/components/OverlaySpinner";

// 1️⃣ User interface
interface User {
  id: string;
  email: string;
  name?: string;
}

// 2️⃣ Context type
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

// 3️⃣ Create context
const AuthContext = createContext<AuthContextType | null>(null);

// 4️⃣ AuthProvider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch current user (called on mount)
  const fetchUser = async () => {
    try {
      const res = await apiClient.get("/auth/logedinuser");
      setUser(res.data.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) {
        setUser(null);
      } else {
        console.error("Error fetching user:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout user
  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  // 🔹 On mount
  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <OverlaySpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5️⃣ Hook for usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
