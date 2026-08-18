import React, { useState } from "react";
import "./MesEmpreints.css";
import { useNavigation } from "react-router-dom";

// --- ICÔNES SVG ---
const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

// --- DONNÉES FICTIVES INITIALES ---
const INITIAL_BORROWS = [
  {
    id: 1,
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    borrowDate: "10 août 2026",
    returnDate: "24 août 2026",
    status: "À rendre bientôt", // "En cours", "À rendre bientôt", "En retard", "Terminé"
    extended: false,
  },
  {
    id: 2,
    title: "L'Étranger",
    author: "Albert Camus",
    borrowDate: "05 août 2026",
    returnDate: "28 août 2026",
    status: "En cours",
    extended: false,
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    borrowDate: "15 juillet 2026",
    returnDate: "01 août 2026",
    status: "En retard",
    extended: false,
  },
  {
    id: 4,
    title: "Les Misérables",
    author: "Victor Hugo",
    borrowDate: "01 juin 2026",
    returnDate: "15 juin 2026",
    status: "Terminé",
    extended: false,
  },
  {
    id: 5,
    title: "Le Comte de Monte-Cristo",
    author: "Alexandre Dumas",
    borrowDate: "10 mai 2026",
    returnDate: "24 mai 2026",
    status: "Terminé",
    extended: false,
  },
];

export default function MesEmpreints() {

  const [borrows, setBorrows] = useState(INITIAL_BORROWS);
  const [activeTab, setActiveTab] = useState("all");

  // Fonction pour simuler la prolongation de la date d'emprunt (+7 jours)
  const handleExtend = (id: number) => {
    setBorrows((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            returnDate: "07 sept. 2026", // Date prolongée simulée
            status: "En cours",
            extended: true,
          };
        }
        return item;
      })
    );
  };

  // Filtrage selon le tab sélectionné
  const filteredBorrows = borrows.filter((item) => {
    if (activeTab === "active") return item.status === "En cours" || item.status === "À rendre bientôt";
    if (activeTab === "late") return item.status === "En retard";
    if (activeTab === "finished") return item.status === "Terminé";
    return true; // "all"
  });

  // Statistiques rapides
  const countActive = borrows.filter((b) => b.status === "En cours" || b.status === "À rendre bientôt").length;
  const countLate = borrows.filter((b) => b.status === "En retard").length;

  return (
    <div className="borrows-container">
      <header className="borrows-header">
        <div>
          <h1>Mes emprunts</h1>
          <p>Consultez vos lectures en cours et gérez vos dates de retour.</p>
        </div>
      </header>

      {/* CARTES DE RÉSUMÉ */}
      <div className="borrows-summary">
        <div className="summary-card">
          <span className="summary-card__value">{countActive}</span>
          <span className="summary-card__label">Emprunt(s) actif(s)</span>
        </div>
        <div className="summary-card summary-card--warning">
          <span className="summary-card__value">{countLate}</span>
          <span className="summary-card__label">En retard</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__value">{borrows.length}</span>
          <span className="summary-card__label">Total historique</span>
        </div>
      </div>

      {/* ONGLETS / FILTRES */}
      <div className="borrows-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tous ({borrows.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          En cours ({countActive})
        </button>
        <button
          className={`tab-btn ${activeTab === "late" ? "active" : ""}`}
          onClick={() => setActiveTab("late")}
        >
          En retard ({countLate})
        </button>
        <button
          className={`tab-btn ${activeTab === "finished" ? "active" : ""}`}
          onClick={() => setActiveTab("finished")}
        >
          Terminés
        </button>
      </div>

      {/* LISTE DES EMPRUNTS */}
      <div className="borrows-list">
        {filteredBorrows.length > 0 ? (
          filteredBorrows.map((book) => (
            <div className={`borrow-card ${book.status === "En retard" ? "borrow-card--late" : ""}`} key={book.id}>
              <div className="borrow-card__cover">
                <BookIcon />
              </div>

              <div className="borrow-card__info">
                <div className="borrow-card__header">
                  <h3>{book.title}</h3>
                  <span
                    className={`status-badge status--${
                      book.status === "À rendre bientôt"
                        ? "warning"
                        : book.status === "En retard"
                        ? "danger"
                        : book.status === "Terminé"
                        ? "gray"
                        : "success"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>

                <p className="borrow-card__author">{book.author}</p>

                <div className="borrow-card__dates">
                  <span className="date-item">
                    <CalendarIcon /> Emprunté le : <strong>{book.borrowDate}</strong>
                  </span>
                  <span className="date-item">
                    <CalendarIcon /> Retour prévu :{" "}
                    <strong className={book.status === "En retard" ? "text-danger" : ""}>
                      {book.returnDate}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="borrow-card__actions">
                {book.status !== "Terminé" && (
                  <button
                    className="extend-btn"
                    disabled={book.extended || book.status === "En retard"}
                    onClick={() => handleExtend(book.id)}
                  >
                    <RefreshIcon />
                    {book.extended ? "Déjà prolongé" : "Prolonger (+14j)"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-borrows">
            <p>Aucun emprunt ne correspond à ce filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
}