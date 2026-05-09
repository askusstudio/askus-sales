"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export type User = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "member";
};

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("sales_tracker_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (pathname === "/login") {
          router.push("/");
        }
      } catch (e) {
        localStorage.removeItem("sales_tracker_user");
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    } else if (pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("sales_tracker_user", JSON.stringify(userData));
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sales_tracker_user");
    router.push("/login");
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
