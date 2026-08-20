import React, { useEffect, useState } from "react";
import "./AdminBook.css";

// ============================================================
// TYPE LIVRE
// ============================================================

export interface Book {
  id_livre: number;
  titre: string;
  auteur: string;
  categorie: string;
  exemplaire: number;
}

// ============================================================
// CONFIGURATION API
// ============================================================

const API_URL = "http://localhost:8000";

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

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
// CATÉGORIES
// ============================================================

const CATEGORIES = [
  "Toutes",
  "Roman",
  "Science-Fiction",
  "Classique",
  "Histoire",
  "Essai",
];

// ============================================================
// COMPOSANT
// ============================================================

export default function AdminBooks() {
  // ----------------------------------------------------------
  // STATES
  // ----------------------------------------------------------

  const [books, setBooks] = useState<Book[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("Toutes");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [currentBook, setCurrentBook] =
    useState<Book | null>(null);

  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    categorie: "Roman",
    exemplaire: 1,
  });

  // ==========================================================
  // RÉCUPÉRER LE TOKEN
  // ==========================================================

  const getToken = (): string | null => {
    /*
     * Selon ton système de login, le token peut être
     * enregistré sous différents noms.
     *
     * On teste plusieurs possibilités.
     */

    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken")
    );
  };

  // ==========================================================
  // HEADERS AUTHENTIFICATION
  // ==========================================================

  const getAuthHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  // ==========================================================
  // RÉCUPÉRER LES LIVRES
  // ==========================================================

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/livres/`
      );

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}`
        );
      }

      const data = await response.json();

      setBooks(data);
    } catch (error) {
      console.error(
        "Erreur récupération des livres :",
        error
      );

      setError(
        "Impossible de récupérer les livres depuis le serveur."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CHARGEMENT INITIAL
  // ==========================================================

  useEffect(() => {
    fetchBooks();
  }, []);

  // ==========================================================
  // OUVRIR MODAL AJOUT
  // ==========================================================

  const handleOpenAddModal = () => {
    setCurrentBook(null);

    setFormData({
      titre: "",
      auteur: "",
      categorie: "Roman",
      exemplaire: 1,
    });

    setError("");

    setIsModalOpen(true);
  };

  // ==========================================================
  // OUVRIR MODAL MODIFICATION
  // ==========================================================

  const handleOpenEditModal = (book: Book) => {
    setCurrentBook(book);

    setFormData({
      titre: book.titre,
      auteur: book.auteur,
      categorie: book.categorie,
      exemplaire: book.exemplaire,
    });

    setError("");

    setIsModalOpen(true);
  };

  // ==========================================================
  // FERMER MODAL
  // ==========================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null);

    setFormData({
      titre: "",
      auteur: "",
      categorie: "Roman",
      exemplaire: 1,
    });
  };

  // ==========================================================
  // CRÉER / MODIFIER
  // ==========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    try {
      const token = getToken();

      // ------------------------------------------------------
      // Vérification du token pour les opérations Admin
      // ------------------------------------------------------

      if (!token) {
        setError(
          "Vous devez être connecté en tant qu'administrateur."
        );

        return;
      }

      const body = {
        titre: formData.titre.trim(),
        auteur: formData.auteur.trim(),
        categorie: formData.categorie,
        exemplaire: Number(formData.exemplaire),
      };

      // ------------------------------------------------------
      // MODIFICATION
      // ------------------------------------------------------

      if (currentBook) {
        const response = await fetch(
          `${API_URL}/livres/${currentBook.id_livre}`,
          {
            method: "PUT",

            headers: getAuthHeaders(),

            body: JSON.stringify(body),
          }
        );

        if (response.status === 401) {
          setError(
            "Non autorisé. Votre session Admin est invalide ou expirée."
          );

          return;
        }

        if (response.status === 403) {
          setError(
            "Accès refusé. Vous devez être administrateur."
          );

          return;
        }

        if (!response.ok) {
          const errorData =
            await response.json().catch(() => null);

          console.error(
            "Erreur modification :",
            errorData
          );

          throw new Error(
            `Erreur HTTP ${response.status}`
          );
        }

        await fetchBooks();

        alert("Livre modifié avec succès !");

        handleCloseModal();

        return;
      }

      // ------------------------------------------------------
      // CRÉATION
      // ------------------------------------------------------

      const response = await fetch(
        `${API_URL}/livres/`,
        {
          method: "POST",

          headers: getAuthHeaders(),

          body: JSON.stringify(body),
        }
      );

      if (response.status === 401) {
        setError(
          "Non autorisé. Votre session Admin est invalide ou expirée."
        );

        return;
      }

      if (response.status === 403) {
        setError(
          "Accès refusé. Vous devez être administrateur."
        );

        return;
      }

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        console.error(
          "Erreur création :",
          errorData
        );

        throw new Error(
          `Erreur HTTP ${response.status}`
        );
      }

      await fetchBooks();

      alert("Livre créé avec succès !");

      handleCloseModal();
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement :",
        error
      );

      setError(
        "Une erreur est survenue lors de l'enregistrement du livre."
      );
    }
  };

  // ==========================================================
  // SUPPRIMER
  // ==========================================================

  const handleDelete = async (
    id_livre: number
  ) => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce livre ?"
    );

    if (!confirmation) {
      return;
    }

    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError(
          "Vous devez être connecté en tant qu'administrateur."
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/livres/${id_livre}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setError(
          "Non autorisé. Votre session Admin est invalide ou expirée."
        );

        return;
      }

      if (response.status === 403) {
        setError(
          "Accès refusé. Vous devez être administrateur."
        );

        return;
      }

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        console.error(
          "Erreur suppression :",
          errorData
        );

        throw new Error(
          `Erreur HTTP ${response.status}`
        );
      }

      await fetchBooks();

      alert("Livre supprimé avec succès !");
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error
      );

      setError(
        "Impossible de supprimer le livre."
      );
    }
  };

  // ==========================================================
  // FILTRAGE
  // ==========================================================

  const filteredBooks = books.filter(
    (book) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        book.titre
          .toLowerCase()
          .includes(search) ||
        book.auteur
          .toLowerCase()
          .includes(search) ||
        book.categorie
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        selectedCategory === "Toutes" ||
        book.categorie ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <div className="admin-books">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="admin-books__header">

        <div>
          <h1 className="admin-books__title">
            Gestion des livres
          </h1>

          <p className="admin-books__subtitle">
            Gérez le catalogue, suivez la
            disponibilité et ajoutez des ouvrages
          </p>
        </div>

        <button
          className="btn btn--primary"
          onClick={handleOpenAddModal}
        >
          <PlusIcon />
          Ajouter un livre
        </button>

      </header>

      {/* ======================================================
          MESSAGE ERREUR
      ====================================================== */}

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <div className="admin-books__toolbar">

        <div className="search-box">

          <SearchIcon />

          <input
            type="text"
            placeholder="Rechercher par titre, auteur, catégorie..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
        >

          {CATEGORIES.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}

        </select>

      </div>

      {/* ======================================================
          TABLEAU
      ====================================================== */}

      <div className="admin-books__table-container">

        <table className="admin-books__table">

          <thead>

            <tr>

              <th>
                Titre & Auteur
              </th>

              <th>
                Catégorie
              </th>

              <th>
                Exemplaires
              </th>

              <th>
                Statut
              </th>

              <th className="text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {/* CHARGEMENT */}

            {loading ? (

              <tr>

                <td
                  colSpan={5}
                  className="empty-state"
                >
                  Chargement des livres...
                </td>

              </tr>

            ) : filteredBooks.length > 0 ? (

              filteredBooks.map(
                (book) => {

                  let statusClass =
                    "badge--success";

                  let statusText =
                    "Disponible";

                  if (
                    book.exemplaire === 0
                  ) {
                    statusClass =
                      "badge--danger";

                    statusText =
                      "Épuisé";
                  } else if (
                    book.exemplaire === 1
                  ) {
                    statusClass =
                      "badge--warning";

                    statusText =
                      "Stock limité";
                  }

                  return (
                    <tr
                      key={
                        book.id_livre
                      }
                    >

                      {/* TITRE / AUTEUR */}

                      <td>

                        <div className="book-info">

                          <span className="book-info__title">
                            {book.titre}
                          </span>

                          <span className="book-info__author">
                            {book.auteur}
                          </span>

                        </div>

                      </td>

                      {/* CATÉGORIE */}

                      <td>

                        <span className="category-tag">
                          {book.categorie}
                        </span>

                      </td>

                      {/* EXEMPLAIRES */}

                      <td>

                        <strong>
                          {book.exemplaire}
                        </strong>

                      </td>

                      {/* STATUT */}

                      <td>

                        <span
                          className={`badge ${statusClass}`}
                        >
                          {statusText}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="actions-cell">

                          <button
                            className="btn-icon btn-icon--edit"
                            onClick={() =>
                              handleOpenEditModal(
                                book
                              )
                            }
                            title="Modifier"
                          >
                            <EditIcon />
                          </button>

                          <button
                            className="btn-icon btn-icon--delete"
                            onClick={() =>
                              handleDelete(
                                book.id_livre
                              )
                            }
                            title="Supprimer"
                          >
                            <TrashIcon />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )

            ) : (

              <tr>

                <td
                  colSpan={5}
                  className="empty-state"
                >
                  Aucun livre trouvé.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {isModalOpen && (

        <div
          className="modal-overlay"
          onClick={
            handleCloseModal
          }
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
                {currentBook
                  ? "Modifier le livre"
                  : "Ajouter un livre"}
              </h2>

              <button
                className="modal-close"
                onClick={
                  handleCloseModal
                }
              >
                <CloseIcon />
              </button>

            </div>

            {/* FORMULAIRE */}

            <form
              onSubmit={handleSubmit}
              className="modal-form"
            >

              {/* TITRE */}

              <div className="form-group">

                <label>
                  Titre de l'ouvrage
                </label>

                <input
                  type="text"
                  required
                  value={
                    formData.titre
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      titre:
                        e.target.value,
                    })
                  }
                  placeholder="ex: Le Petit Prince"
                />

              </div>

              {/* AUTEUR */}

              <div className="form-group">

                <label>
                  Auteur
                </label>

                <input
                  type="text"
                  required
                  value={
                    formData.auteur
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      auteur:
                        e.target.value,
                    })
                  }
                  placeholder="ex: Antoine de Saint-Exupéry"
                />

              </div>

              {/* CATÉGORIE */}

              <div className="form-group">

                <label>
                  Catégorie
                </label>

                <select
                  value={
                    formData.categorie
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categorie:
                        e.target.value,
                    })
                  }
                >

                  {CATEGORIES
                    .filter(
                      (category) =>
                        category !==
                        "Toutes"
                    )
                    .map(
                      (category) => (
                        <option
                          key={category}
                          value={
                            category
                          }
                        >
                          {category}
                        </option>
                      )
                    )}

                </select>

              </div>

              {/* EXEMPLAIRES */}

              <div className="form-group">

                <label>
                  Nombre d'exemplaires
                </label>

                <input
                  type="number"
                  min="0"
                  required
                  value={
                    formData.exemplaire
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exemplaire:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                />

              </div>

              {/* BOUTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={
                    handleCloseModal
                  }
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="btn btn--primary"
                >
                  {currentBook
                    ? "Enregistrer"
                    : "Créer le livre"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}