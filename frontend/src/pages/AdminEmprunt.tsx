import React, { useState } from "react";
import "./AdminEmprunt.css";

// 1. DÉFINITION DU TYPE BORROW (Prêt / Emprunt)
export interface Borrow {
  id: number;
  bookTitle: string;
  userName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: "En cours" | "En retard" | "Rendu";
}

// --- ICÔNES SVG ---
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Données fictives initiales
const INITIAL_BORROWS: Borrow[] = [
  { id: 1, bookTitle: "Le Petit Prince", userName: "Alice Martin", borrowDate: "2026-08-01", dueDate: "2026-08-15", status: "En retard" },
  { id: 2, bookTitle: "1984", userName: "Thomas Dubois", borrowDate: "2026-08-10", dueDate: "2026-08-24", status: "En cours" },
  { id: 3, bookTitle: "L'Étranger", userName: "Emma Moreau", borrowDate: "2026-07-15", dueDate: "2026-07-29", returnDate: "2026-07-28", status: "Rendu" },
  { id: 4, bookTitle: "Dune", userName: "Lucas Petit", borrowDate: "2026-08-05", dueDate: "2026-08-19", status: "En cours" },
  { id: 5, bookTitle: "Fondation", userName: "Sophie Bernard", borrowDate: "2026-07-01", dueDate: "2026-07-15", returnDate: "2026-07-14", status: "Rendu" },
];

const STATUS_FILTERS = ["Tous", "En cours", "En retard", "Rendu"];

export default function AdminEmprunt() {
  const [borrows, setBorrows] = useState<Borrow[]>(INITIAL_BORROWS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");

  // État de la modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Formulaire local pour un nouveau prêt
  const [formData, setFormData] = useState({
    bookTitle: "",
    userName: "",
    borrowDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +14 jours par défaut
  });

  // Ouvrir modal pour nouvel emprunt
  const handleOpenAddModal = () => {
    setFormData({
      bookTitle: "",
      userName: "",
      borrowDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  // Enregistrer un nouveau prêt
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBorrow: Borrow = {
      id: Date.now(),
      ...formData,
      status: "En cours",
    };

    setBorrows([newBorrow, ...borrows]);
    setIsModalOpen(false);
  };

  // Marquer un emprunt comme rendu
  const handleReturn = (id: number) => {
    const today = new Date().toISOString().split("T")[0];
    setBorrows(
      borrows.map((b) =>
        b.id === id
          ? {
              ...b,
              returnDate: today,
              status: "Rendu",
            }
          : b
      )
    );
  };

  // Suppression d'un enregistrement
  const handleDelete = (id: number) => {
    if (window.confirm("Voulez-vous supprimer cet enregistrement d'emprunt ?")) {
      setBorrows(borrows.filter((b) => b.id !== id));
    }
  };

  // Filtrage des emprunts
  const filteredBorrows = borrows.filter((borrow) => {
    const matchesSearch =
      borrow.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "Tous" || borrow.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-borrows">
      {/* EN-TÊTE */}
      <header className="admin-borrows__header">
        <div>
          <h1 className="admin-borrows__title">Suivi des emprunts</h1>
          <p className="admin-borrows__subtitle">
            Gérez les emprunts actifs, enregistrez les retours et suivez les retards
          </p>
        </div>
        <button className="btn btn--primary" onClick={handleOpenAddModal}>
          <PlusIcon /> Enregistrer un prêt
        </button>
      </header>

      {/* BARRE DE FILTRES ET RECHERCHE */}
      <div className="admin-borrows__toolbar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher par livre ou emprunteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="status-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {STATUS_FILTERS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* TABLEAU DES EMPRUNTS */}
      <div className="admin-borrows__table-container">
        <table className="admin-borrows__table">
          <thead>
            <tr>
              <th>Livre</th>
              <th>Emprunteur</th>
              <th>Date de prêt</th>
              <th>Retour prévu</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrows.length > 0 ? (
              filteredBorrows.map((borrow) => {
                let statusClass = "badge--info";
                if (borrow.status === "Rendu") statusClass = "badge--success";
                if (borrow.status === "En retard") statusClass = "badge--danger";

                return (
                  <tr key={borrow.id}>
                    <td>
                      <span className="book-title">{borrow.bookTitle}</span>
                    </td>
                    <td>
                      <span className="user-name">{borrow.userName}</span>
                    </td>
                    <td>{borrow.borrowDate}</td>
                    <td>
                      <span
                        className={
                          borrow.status === "En retard" ? "date-overdue" : ""
                        }
                      >
                        {borrow.dueDate}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${statusClass}`}>
                        {borrow.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {borrow.status !== "Rendu" && (
                          <button
                            className="btn-icon btn-icon--success"
                            onClick={() => handleReturn(borrow.id)}
                            title="Marquer comme rendu"
                          >
                            <CheckIcon />
                          </button>
                        )}
                        <button
                          className="btn-icon btn-icon--delete"
                          onClick={() => handleDelete(borrow.id)}
                          title="Supprimer l'historique"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="empty-state">
                  Aucun emprunt ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL NOUVEAU PRÊT */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enregistrer un nouveau prêt</h2>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Titre du livre</label>
                <input
                  type="text"
                  required
                  value={formData.bookTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, bookTitle: e.target.value })
                  }
                  placeholder="ex: Le Petit Prince"
                />
              </div>

              <div className="form-group">
                <label>Nom de l'emprunteur</label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  placeholder="ex: Alice Martin"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date de prêt</label>
                  <input
                    type="date"
                    required
                    value={formData.borrowDate}
                    onChange={(e) =>
                      setFormData({ ...formData, borrowDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Date de retour prévue</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  Valider le prêt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}