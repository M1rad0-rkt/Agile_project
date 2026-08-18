import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./UserLayout.css";

// --- ICÔNES SVG ---
const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// Ajout d'icônes à vos éléments de menu
const navItems = [
  { to: "/dashboard", label: "Tableau de bord", icon: <DashboardIcon />, end: true },
  { to: "/dashboard/catalogue", label: "Catalogue", icon: <BookIcon /> },
  { to: "/dashboard/emprunts", label: "Mes emprunts", icon: <BookmarkIcon /> },
  { to: "/dashboard/profil", label: "Mon profil", icon: <UserIcon /> },
];

export default function UserLayout() {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="user-layout">
      <aside className={`user-sidebar ${isCollapsed ? "user-sidebar--collapsed" : ""}`}>
        
        {/* EN-TÊTE : LOGO + BOUTON RÉDUIRE/DÉVELOPPER */}
        <div className="user-sidebar__header">
          <div className="user-sidebar__brand">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>

            {!isCollapsed && <span>Bibliothèque</span>}
          </div>

          <button
            className="user-sidebar__toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Développer le menu" : "Réduire le menu"}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="user-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                "user-sidebar__link" +
                (isActive ? " user-sidebar__link--active" : "")
              }
            >
              <span className="user-sidebar__icon">{item.icon}</span>
              {!isCollapsed && <span className="user-sidebar__label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* BOUTON DÉCONNEXION EN BAS */}
        <button
          className="user-sidebar__logout"
          onClick={logout}
          title={isCollapsed ? "Déconnexion" : undefined}
        >
          <span className="user-sidebar__icon"><LogoutIcon /></span>
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </aside>

      <main className="user-content">
        <Outlet />
      </main>
    </div>
  );
}