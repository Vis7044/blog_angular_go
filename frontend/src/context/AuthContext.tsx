'use client';
// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { AxiosError } from "axios";
import { authService } from "@/services/authService";
import OverlaySpinner from "@/components/OverlaySpinner";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      window.location.href = "/";
    }
  };

  const fetchUser = async () => {
    try {
      const res = await authService.fetchCurrentUser();
      setUser(res.data.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) logout();
      else setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) fetchUser();
    else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <OverlaySpinner/>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
