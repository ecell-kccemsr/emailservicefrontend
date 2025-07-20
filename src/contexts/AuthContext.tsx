import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Admin } from "../types";
import { apiService } from "../services/api";

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = apiService.getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await apiService.getProfile();
      setAdmin(response.admin);
    } catch (error) {
      console.error("Auth check failed:", error);
      apiService.removeAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiService.login(email, password);

      apiService.setAuthToken(response.token);
      localStorage.setItem("admin_data", JSON.stringify(response.admin));
      setAdmin(response.admin);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.removeAuthToken();
    setAdmin(null);
    setError(null);
  };

  const value: AuthContextType = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
