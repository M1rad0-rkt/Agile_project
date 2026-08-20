import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  console.log("✅ FORMULAIRE ENVOYÉ");
  console.log("Email :", email);
  console.log("Password :", password);

  setError("");
  setLoading(true);

  try {
    console.log("🔵 Appel de login()...");

    const result = await login(email, password);

    console.log("🟢 Réponse de login() :", result);

    if (result.success) {
      console.log("✅ Connexion réussie");
      console.log("Role :", result.role);

      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      console.log("❌ Connexion refusée :", result.message);
      setError(
        result.message ?? "Erreur de connexion"
      );
    }
  } catch (error) {
    console.error("🔥 Erreur :", error);
    setError("Une erreur est survenue.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-card">

        <div className="login-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <div className="input-group">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M4 4h16v16H4z" opacity="0" />
                <path d="M22 6l-10 7L2 6" />
                <path d="M2 6h20v12H2z" />
              </svg>
            </span>

            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="9"
                  rx="1"
                />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>

            <input
              type="password"
              placeholder="MOT DE PASSE"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "CONNEXION..."
              : "CONNEXION"}
          </button>

          <a
            href="#"
            className="login-forgot"
          >
            Mot de passe oublié ?
          </a>

        </form>
      </div>
    </div>
  );
}