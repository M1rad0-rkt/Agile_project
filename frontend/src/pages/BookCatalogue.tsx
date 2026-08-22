import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // ajuste le chemin selon ton arborescence
import "./BookCatalogue.css";

export interface Livre {
  id_livre: number;
  titre: string;
  auteur: string;
  categorie: string | null;
  exemplaire: number;
}

const API_URL = "http://localhost:8000";

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const AlertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function BookCatalog() {
  const { user } = useAuth();

  const [books, setBooks] = useState<Livre[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const [borrowingId, setBorrowingId] = useState<number | null>(null);
  const [borrowedIds, setBorrowedIds] = useState<Set<number>>(new Set());

  const [modal, setModal] = useState<{ message: string; isError: boolean } | null>(null);

  const fetchLivres = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/livres/`, { method: "GET" });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Erreur ${response.status}`);
      }

      const data: Livre[] = await response.json();
      setBooks(data);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erreur lors du chargement des livres."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLivres();
  }, []);

  useEffect(() => {
    const fetchMesEmprunts = async () => {
      const token = localStorage.getItem("access_token");
      if (!user || user.role !== "membre" || !token) return;

      try {
        const response = await fetch(`${API_URL}/emprunts/mes-emprunts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data: { id_livre: number }[] = await response.json();
          setBorrowedIds(new Set(data.map((e) => e.id_livre)));
        }
      } catch {
        // silencieux — pas critique si ça échoue
      }
    };

    fetchMesEmprunts();
  }, [user]);

  const categories = [
    "Tous",
    ...Array.from(
      new Set(books.map((b) => b.categorie).filter((c): c is string => !!c))
    ),
  ];

  // 👇 On ne garde que les livres avec au moins un exemplaire disponible
  const availableBooks = books.filter((book) => book.exemplaire > 0);

  const filteredBooks = availableBooks.filter((book) => {
    const matchesSearch =
      book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.auteur.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Tous" || book.categorie === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEmprunter = async (id_livre: number) => {
    const token = localStorage.getItem("access_token");

    if (!user || !token) {
      setModal({ message: "Vous devez être connecté pour emprunter un livre.", isError: true });
      return;
    }

    if (user.role !== "membre") {
      setModal({ message: "Seuls les membres peuvent emprunter un livre.", isError: true });
      return;
    }

    setBorrowingId(id_livre);

    try {
      const response = await fetch(`${API_URL}/emprunts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_livre }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Erreur ${response.status}`);
      }

      const book = books.find((b) => b.id_livre === id_livre);
      setModal({
        message: `« ${book?.titre ?? "Le livre"} » a été emprunté avec succès.`,
        isError: false,
      });

      setBorrowedIds((prev) => new Set(prev).add(id_livre));
      // Recharge le catalogue — le livre disparaîtra de la liste si exemplaire tombe à 0
      fetchLivres();
    } catch (err) {
      setModal({
        message: err instanceof Error ? err.message : "Erreur lors de l'emprunt.",
        isError: true,
      });
    } finally {
      setBorrowingId(null);
    }
  };

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <h1>Catalogue de la bibliothèque</h1>
        <p>Explorez notre collection et trouvez votre prochaine lecture.</p>
      </header>

      <section className="catalog-controls">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher par titre ou auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-chip ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="books-grid">
        {isLoading ? (
          <div className="no-results">
            <p>Chargement du catalogue...</p>
          </div>
        ) : errorMessage ? (
          <div className="no-results">
            <p>{errorMessage}</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book) => {
            const isBorrowingThis = borrowingId === book.id_livre;
            const alreadyBorrowedByMe = borrowedIds.has(book.id_livre);

            let buttonLabel = "Emprunter";
            let buttonDisabled = isBorrowingThis;

            if (isBorrowingThis) {
              buttonLabel = "Emprunt...";
            } else if (alreadyBorrowedByMe) {
              buttonLabel = "Déjà emprunté";
              buttonDisabled = true;
            }

            return (
              <div className="book-card" key={book.id_livre}>
                <div className="book-card__cover">
                  <BookIcon />
                </div>
                <div className="book-card__content">
                  <span className="book-card__category">
                    {book.categorie || "Non catégorisé"}
                  </span>
                  <h3 className="book-card__title">{book.titre}</h3>
                  <p className="book-card__author">{book.auteur}</p>

                  <div className="book-card__footer">
                    <span
                      className={`status-badge ${
                        alreadyBorrowedByMe ? "status--unavailable" : "status--available"
                      }`}
                    >
                      {alreadyBorrowedByMe
                        ? "Emprunté par vous"
                        : `${book.exemplaire} disponible${book.exemplaire > 1 ? "s" : ""}`}
                    </span>

                    <button
                      className="action-btn"
                      disabled={buttonDisabled}
                      onClick={() => handleEmprunter(book.id_livre)}
                    >
                      {buttonLabel}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>Aucun livre disponible ne correspond à votre recherche.</p>
          </div>
        )}
      </section>

      {modal && (
        <div className="catalog-modal-overlay" onClick={() => setModal(null)}>
          <div className="catalog-modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              className="catalog-modal-icon"
              style={{ color: modal.isError ? "#dc2626" : "#16a34a" }}
            >
              {modal.isError ? <AlertIcon /> : <CheckIcon />}
            </div>
            <p className="catalog-modal-message">{modal.message}</p>
            <button className="action-btn catalog-modal-ok" onClick={() => setModal(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}