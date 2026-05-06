import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login as loginService } from "@/services/authService";

type User = {
  id: number;
  username: string;
  role: string;
  clinic: {
    id: number;
    name: string;
  };
  is_superuser: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (clinic: string, username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (
    clinic: string,
    username: string,
    password: string
  ) => {
    await loginService(clinic, username, password);

    const data = await getCurrentUser();
    setUser(data);
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}