import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Role = "admin" | "membre";

interface User {
  email: string;
  role: Role;
}

interface LoginResult {
  success: boolean;
  role?: Role;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role") as Role | null;
    const email = localStorage.getItem("email");

    if (token && role && email) {
      return {
        email,
        role,
      };
    }

    return null;
  });

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      // FastAPI utilise OAuth2PasswordRequestForm.
      // Il faut donc envoyer du x-www-form-urlencoded
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(
        "http://localhost:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const data = await response.json();

      // Login incorrect
      if (!response.ok) {
        return {
          success: false,
          message:
            data.detail || "Email ou mot de passe incorrect",
        };
      }

      // Vérification du token
      if (!data.access_token) {
        return {
          success: false,
          message: "Le serveur n'a pas retourné de token.",
        };
      }

      const token = data.access_token;

      /*
       * Ton backend met le rôle dans le JWT :
       *
       * {
       *   "sub": "...",
       *   "email": "...",
       *   "role": "admin"
       * }
       *
       * On récupère donc le payload du JWT.
       */
      const payloadBase64 = token.split(".")[1];

      const payload = JSON.parse(
        atob(payloadBase64)
      );

      const role = payload.role as Role;

      if (role !== "admin" && role !== "membre") {
        return {
          success: false,
          message: "Rôle utilisateur invalide.",
        };
      }

      // Stockage des informations de connexion
      localStorage.setItem("access_token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      // Mise à jour du contexte
      setUser({
        email,
        role,
      });

      return {
        success: true,
        role,
      };
    } catch (error) {
      console.error("Erreur de connexion :", error);

      return {
        success: false,
        message: "Impossible de contacter le serveur.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }

  return context;
}