import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";

import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./pages/UserDashboard";
// 1. Importer le composant BookCatalog (ajustez le chemin selon votre dossier)
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

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >

            
            <Route index element={<AdminDashboard />} />
          <Route path="/admin/livres" element={<AdminBooks />} />
          <Route path="/admin/utilisateurs" element={<AdminUsers/>}/>
          <Route path="/admin/emprunts" element={<AdminEmprunt />} />
          </Route>

          {/* USER */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
          <Route path="/dashboard/catalogue" element={<BookCatalog />} />
          <Route path="/dashboard/emprunts" element={<MesEmpreints />} />
          <Route path="/dashboard/profil" element={<UserProfile />} />
          </Route>
          
          {/* ROUTE PAR DÉFAUT */}
          <Route path="*" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;