import React, { useEffect, useMemo, useState } from "react";
import "./AdminEmprunt.css";

// ============================================================
// CONFIGURATION
// ============================================================

const API_URL = "http://localhost:8000";

// ============================================================
// TYPES
// ============================================================

interface Livre {
  id_livre: number;
  titre: string;
  auteur: string;
  categorie: string;
  exemplaire: number;
}

interface Membre {
  id_membre: number;
  nom: string;
  prenom: string;
  email: string;
}

interface EmpruntResponse {
  id_emprunt?: number;
  id_membre: number;
  id_livre: number;
  date_emprunt: string;
}

interface Borrow {
  id: number;
  bookTitle: string;
  userName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: "En cours" | "En retard" | "Rendu";
}

// ============================================================
// ICÔNES
// ============================================================

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ============================================================
// HELPERS
// ============================================================

function getToken(): string | null {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken")
  );
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

function formatDate(dateString: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("fr-FR");
}

function calculateDueDate(dateEmprunt: string): string {
  const date = new Date(dateEmprunt);

  date.setDate(date.getDate() + 14);

  return date.toISOString().split("T")[0];
}

// ============================================================
// COMPOSANT
// ============================================================

export default function AdminEmprunt() {
  // ----------------------------------------------------------
  // DATA
  // ----------------------------------------------------------

  const [livres, setLivres] = useState<Livre[]>([]);
  const [membres, setMembres] = useState<Membre[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------------------------------------
  // FORMULAIRE
  // ----------------------------------------------------------

  const [selectedBookId, setSelectedBookId] = useState<number | "">("");

  // ==========================================================
  // CHARGEMENT DES LIVRES
  // ==========================================================

  const fetchLivres = async () => {
    try {
      const response = await fetch(`${API_URL}/livres/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors du chargement des livres (${response.status})`
        );
      }

      const data: Livre[] = await response.json();

      setLivres(data);
    } catch (err) {
      console.error(err);

      setError(
        "Impossible de récupérer les livres depuis le serveur."
      );
    }
  };

  // ==========================================================
  // CHARGEMENT DES MEMBRES
  // ==========================================================

  const fetchMembres = async () => {
    try {
      const response = await fetch(`${API_URL}/membres/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors du chargement des membres (${response.status})`
        );
      }

      const data: Membre[] = await response.json();

      setMembres(data);
    } catch (err) {
      console.error(err);

      /*
       * Ce n'est pas bloquant pour la création d'un emprunt,
       * car ton backend utilise automatiquement le membre
       * connecté grâce à get_current_membre().
       */
    }
  };

  // ==========================================================
  // CHARGEMENT INITIAL
  // ==========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchLivres(),
        fetchMembres(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // ==========================================================
  // MEMBRE CONNECTÉ
  // ==========================================================

  /*
   * Ton backend ne demande PAS id_membre dans le POST.
   *
   * Il récupère automatiquement :
   *
   * membre=Depends(get_current_membre)
   *
   * Donc le frontend n'a pas besoin d'envoyer l'id du membre.
   */

  const currentMember = useMemo(() => {
    /*
     * Si ton application stocke déjà l'utilisateur connecté
     * dans localStorage sous "user", on essaie de le récupérer.
     */

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser) as Membre;
    } catch {
      return null;
    }
  }, []);

  // ==========================================================
  // OUVRIR MODAL
  // ==========================================================

  const handleOpenAddModal = () => {
    setError("");
    setSuccess("");

    setSelectedBookId("");

    setIsModalOpen(true);
  };

  // ==========================================================
  // FERMER MODAL
  // ==========================================================

  const handleCloseModal = () => {
    if (creating) return;

    setIsModalOpen(false);
    setSelectedBookId("");
  };

  // ==========================================================
  // CRÉER EMPRUNT
  // ==========================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (selectedBookId === "") {
      setError("Veuillez sélectionner un livre.");
      return;
    }

    const livre = livres.find(
      (item) => item.id_livre === Number(selectedBookId)
    );

    if (!livre) {
      setError("Livre introuvable.");
      return;
    }

    if (livre.exemplaire <= 0) {
      setError("Ce livre n'est plus disponible.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Vous devez être connecté pour enregistrer un emprunt."
      );
      return;
    }

    try {
      setCreating(true);

      /*
       * IMPORTANT :
       *
       * Ton backend attend uniquement :
       *
       * {
       *   "id_livre": 1
       * }
       *
       * Le membre est récupéré automatiquement côté backend.
       */

      const response = await fetch(`${API_URL}/emprunts/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id_livre: Number(selectedBookId),
        }),
      });

      if (!response.ok) {
        let message = "Impossible de créer l'emprunt.";

        try {
          const errorData = await response.json();

          if (errorData.detail) {
            if (typeof errorData.detail === "string") {
              message = errorData.detail;
            } else {
              message = JSON.stringify(errorData.detail);
            }
          }
        } catch {
          // réponse non JSON
        }

        throw new Error(message);
      }

      const data: EmpruntResponse = await response.json();

      // Date réelle donnée par le backend
      const borrowDate =
        data.date_emprunt ||
        new Date().toISOString().split("T")[0];

      const dueDate = calculateDueDate(borrowDate);

      /*
       * Comme ton backend ne possède actuellement pas
       * de GET /emprunts/, on ajoute l'emprunt créé
       * directement dans l'affichage local.
       */

      const userName = currentMember
        ? `${currentMember.prenom} ${currentMember.nom}`
        : "Membre connecté";

      const newBorrow: Borrow = {
        id: data.id_emprunt ?? Date.now(),
        bookTitle: livre.titre,
        userName,
        borrowDate,
        dueDate,
        status: "En cours",
      };

      setBorrows((previous) => [newBorrow, ...previous]);

      // Mise à jour locale de la disponibilité
      setLivres((previous) =>
        previous.map((item) =>
          item.id_livre === livre.id_livre
            ? {
                ...item,
                exemplaire: Math.max(0, item.exemplaire - 1),
              }
            : item
        )
      );

      setSuccess("L'emprunt a été enregistré avec succès.");

      setIsModalOpen(false);
      setSelectedBookId("");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================================
  // FILTRAGE
  // ==========================================================

  const filteredBorrows = borrows.filter((borrow) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      borrow.bookTitle.toLowerCase().includes(search) ||
      borrow.userName.toLowerCase().includes(search);

    const matchesStatus =
      selectedStatus === "Tous" ||
      borrow.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <div className="admin-borrows">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="admin-borrows__header">
        <div>
          <h1 className="admin-borrows__title">
            Suivi des emprunts
          </h1>

          <p className="admin-borrows__subtitle">
            Gérez les emprunts actifs et enregistrez les nouveaux prêts
          </p>
        </div>

        <button
          className="btn btn--primary"
          onClick={handleOpenAddModal}
        >
          <PlusIcon />
          Enregistrer un prêt
        </button>
      </header>

      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "#dcfce7",
            color: "#15803d",
          }}
        >
          {success}
        </div>
      )}

      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="admin-borrows__toolbar">

        <div className="search-box">
          <SearchIcon />

          <input
            type="text"
            placeholder="Rechercher par livre ou emprunteur..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <select
          className="status-select"
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value)
          }
        >
          <option value="Tous">
            Tous
          </option>

          <option value="En cours">
            En cours
          </option>

          <option value="En retard">
            En retard
          </option>

          <option value="Rendu">
            Rendu
          </option>
        </select>
      </div>

      {/* =====================================================
          TABLEAU
      ====================================================== */}

      <div className="admin-borrows__table-container">

        <table className="admin-borrows__table">

          <thead>
            <tr>
              <th>Livre</th>
              <th>Emprunteur</th>
              <th>Date de prêt</th>
              <th>Retour prévu</th>
              <th>Statut</th>
              <th className="text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={6}
                  className="empty-state"
                >
                  Chargement...
                </td>
              </tr>

            ) : filteredBorrows.length > 0 ? (

              filteredBorrows.map((borrow) => {

                let statusClass = "badge--info";

                if (borrow.status === "Rendu") {
                  statusClass = "badge--success";
                }

                if (borrow.status === "En retard") {
                  statusClass = "badge--danger";
                }

                return (
                  <tr key={borrow.id}>

                    <td>
                      <span className="book-title">
                        {borrow.bookTitle}
                      </span>
                    </td>

                    <td>
                      <span className="user-name">
                        {borrow.userName}
                      </span>
                    </td>

                    <td>
                      {formatDate(borrow.borrowDate)}
                    </td>

                    <td>
                      <span
                        className={
                          borrow.status === "En retard"
                            ? "date-overdue"
                            : ""
                        }
                      >
                        {formatDate(borrow.dueDate)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${statusClass}`}
                      >
                        {borrow.status}
                      </span>
                    </td>

                    <td>
                      <div className="actions-cell">

                        {borrow.status !== "Rendu" && (
                          <button
                            className="btn-icon btn-icon--success"
                            title="Marquer comme rendu"
                            disabled
                          >
                            <CheckIcon />
                          </button>
                        )}

                        <span
                          style={{
                            fontSize: "12px",
                            color: "#888",
                          }}
                        >
                          API retour non disponible
                        </span>

                      </div>
                    </td>

                  </tr>
                );
              })

            ) : (

              <tr>
                <td
                  colSpan={6}
                  className="empty-state"
                >
                  Aucun emprunt trouvé.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {isModalOpen && (

        <div
          className="modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="modal-header">

              <h2>
                Enregistrer un nouveau prêt
              </h2>

              <button
                className="modal-close"
                onClick={handleCloseModal}
                disabled={creating}
              >
                <CloseIcon />
              </button>

            </div>

            {/* FORMULAIRE */}

            <form
              onSubmit={handleSubmit}
              className="modal-form"
            >

              {/* LIVRE */}

              <div className="form-group">

                <label>
                  Livre
                </label>

                <select
                  required
                  value={selectedBookId}
                  onChange={(e) => {

                    const value = e.target.value;

                    setSelectedBookId(
                      value === ""
                        ? ""
                        : Number(value)
                    );
                  }}
                >

                  <option value="">
                    -- Sélectionner un livre --
                  </option>

                  {livres.map((livre) => (

                    <option
                      key={livre.id_livre}
                      value={livre.id_livre}
                      disabled={livre.exemplaire <= 0}
                    >
                      {livre.titre}
                      {" — "}
                      {livre.exemplaire} disponible(s)
                    </option>

                  ))}

                </select>

              </div>

              {/* MEMBRE */}

              <div className="form-group">

                <label>
                  Emprunteur
                </label>

                <input
                  type="text"
                  value={
                    currentMember
                      ? `${currentMember.prenom} ${currentMember.nom}`
                      : "Membre connecté"
                  }
                  disabled
                />

                <small>
                  Le membre est automatiquement déterminé
                  par le compte connecté.
                </small>

              </div>

              {/* DATE */}

              <div className="form-group">

                <label>
                  Date du prêt
                </label>

                <input
                  type="text"
                  value="Définie automatiquement par le serveur"
                  disabled
                />

              </div>

              {/* INFO BACKEND */}

              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#f3f4f6",
                  fontSize: "13px",
                  color: "#4b5563",
                  marginTop: "10px",
                }}
              >
                La date d'emprunt est définie automatiquement
                par le backend avec la date du jour.
              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleCloseModal}
                  disabled={creating}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={creating}
                >
                  {creating
                    ? "Enregistrement..."
                    : "Valider le prêt"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}