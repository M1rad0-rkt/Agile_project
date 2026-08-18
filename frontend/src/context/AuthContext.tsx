import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Role = "admin" | "user";

interface User {
  email: string;
  password: string;
  role: Role;
  nom: string;
}

interface LoginResult {
  success: boolean;
  role?: Role;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Utilisateurs simulés (à remplacer plus tard par l'API Django)
const MOCK_USERS: User[] = [
  { email: "admin@biblio.com", password: "admin123", role: "admin", nom: "Admin" },
  { email: "user@biblio.com", password: "user123", role: "user", nom: "Utilisateur" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): LoginResult => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      return { success: true, role: found.role };
    }
    return { success: false, message: "Email ou mot de passe incorrect" };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}