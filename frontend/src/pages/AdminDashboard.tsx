import React from "react";
import "./AdminDashboard.css";

// Icônes SVG intégrées en tant que composants
const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LoanIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M16 3H8a2 2 0 0 0-2 2v16l6-4 6 4V5a2 2 0 0 0-2-2z" />
  </svg>
);

const AlertIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Données des cartes statistiques
const STATS = [
  { label: "Livres", value: 248, icon: <BookIcon />, variant: "blue" },
  { label: "Adhérents", value: 57, icon: <UsersIcon />, variant: "indigo" },
  { label: "Emprunts en cours", value: 34, icon: <LoanIcon />, variant: "green" },
  { label: "Emprunts en retard", value: 5, icon: <AlertIcon />, variant: "red" },
];

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Tableau de bord</h1>
        <p className="admin-dashboard__subtitle">Vue d'ensemble de la bibliothèque</p>
      </header>

      {/* Grille générée directement sans composant externe */}
      <div className="admin-dashboard__grid">
        {STATS.map((stat, index) => (
          <div key={index} className={`stat-card stat-card--${stat.variant}`}>
            <div className="stat-card__icon">
              {stat.icon}
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}