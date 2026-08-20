"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type {
  ProfileResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/api";

interface AuthContextType {
  user: ProfileResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      api
        .getProfile()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await api.login(data);
    localStorage.setItem("token", response.token);
    setToken(response.token);
    const profile = await api.getProfile();
    setUser(profile);
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.register(data);
    localStorage.setItem("token", response.token);
    setToken(response.token);
    const profile = await api.getProfile();
    setUser(profile);
  };

  const googleLogin = async (idToken: string) => {
    const response = await api.googleLogin(idToken);
    localStorage.setItem("token", response.token);
    setToken(response.token);
    const profile = await api.getProfile();
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    const profile = await api.getProfile();
    setUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, googleLogin, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
