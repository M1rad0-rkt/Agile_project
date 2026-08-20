import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";

import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./pages/UserDashboard";

import BookCatalog from "./pages/BookCatalogue";
import MesEmpreints from "./pages/MesEmpreints";
import AdminBooks from "./pages/AdminBook";
import AdminUsers from "./pages/AdminUsers";
import AdminEmprunt from "./pages/AdminEmprunt";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* ================= ADMIN ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route
              path="livres"
              element={<AdminBooks />}
            />

            <Route
              path="utilisateurs"
              element={<AdminUsers />}
            />

            <Route
              path="emprunts"
              element={<AdminEmprunt />}
            />
          </Route>

          {/* ================= MEMBRE ================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="membre">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />

            <Route
              path="catalogue"
              element={<BookCatalog />}
            />

            <Route
              path="emprunts"
              element={<MesEmpreints />}
            />

            <Route
              path="profil"
              element={<UserProfile />}
            />
          </Route>

          {/* ROUTE PAR DÉFAUT */}
          <Route
            path="*"
            element={<Login />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;