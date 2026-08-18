import React, { useState } from "react";
import "./AdminBook.css";

// 1. DÉFINITION DU TYPE BOOK (Résout les erreurs TypeScript / soulignements rouges)
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  total: number;
  available: number;
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

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
const INITIAL_BOOKS: Book[] = [
  { id: 1, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", isbn: "978-2070612758", category: "Roman", total: 5, available: 3 },
  { id: 2, title: "1984", author: "George Orwell", isbn: "978-2070368228", category: "Science-Fiction", total: 4, available: 0 },
  { id: 3, title: "L'Étranger", author: "Albert Camus", isbn: "978-2070360024", category: "Classique", total: 6, available: 4 },
  { id: 4, title: "Fondation", author: "Isaac Asimov", isbn: "978-2207249123", category: "Science-Fiction", total: 3, available: 1 },
  { id: 5, title: "Dune", author: "Frank Herbert", isbn: "978-2266283038", category: "Science-Fiction", total: 5, available: 5 },
];

const CATEGORIES = ["Toutes", "Roman", "Science-Fiction", "Classique", "Histoire", "Essai"];

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");

  // État de la modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  // Formulaire local
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Roman",
    total: 1,
    available: 1,
  });

  // Ouvrir modal pour ajout
  const handleOpenAddModal = () => {
    setCurrentBook(null);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "Roman",
      total: 1,
      available: 1,
    });
    setIsModalOpen(true);
  };

  // Ouvrir modal pour édition
  const handleOpenEditModal = (book: Book) => {
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      total: book.total,
      available: book.available,
    });
    setIsModalOpen(true);
  };

  // Soumission du formulaire (Ajout ou Édition)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalNum = Number(formData.total);
    const availableNum = Number(formData.available);

    if (currentBook) {
      // Édition
      setBooks(
        books.map((b) =>
          b.id === currentBook.id
            ? {
                ...b,
                ...formData,
                total: totalNum,
                available: availableNum,
              }
            : b
        )
      );
    } else {
      // Ajout
      const newBook: Book = {
        id: Date.now(),
        ...formData,
        total: totalNum,
        available: availableNum,
      };
      setBooks([newBook, ...books]);
    }
    setIsModalOpen(false);
  };

  // Suppression
  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  // Filtrage des livres
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "Toutes" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-books">
      {/* EN-TÊTE */}
      <header className="admin-books__header">
        <div>
          <h1 className="admin-books__title">Gestion des livres</h1>
          <p className="admin-books__subtitle">
            Gérez le catalogue, suivez la disponibilité et ajoutez des ouvrages
          </p>
        </div>
        <button className="btn btn--primary" onClick={handleOpenAddModal}>
          <PlusIcon /> Ajouter un livre
        </button>
      </header>

      {/* BARRE DE FILTRES ET RECHERCHE */}
      <div className="admin-books__toolbar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher par titre, auteur, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* TABLEAU DES LIVRES */}
      <div className="admin-books__table-container">
        <table className="admin-books__table">
          <thead>
            <tr>
              <th>Titre & Auteur</th>
              <th>ISBN</th>
              <th>Catégorie</th>
              <th>Exemplaires (Dispo / Total)</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => {
                let statusClass = "badge--success";
                let statusText = "Disponible";

                if (book.available === 0) {
                  statusClass = "badge--danger";
                  statusText = "Épuisé";
                } else if (book.available === 1) {
                  statusClass = "badge--warning";
                  statusText = "Stock limité";
                }

                return (
                  <tr key={book.id}>
                    <td>
                      <div className="book-info">
                        <span className="book-info__title">{book.title}</span>
                        <span className="book-info__author">{book.author}</span>
                      </div>
                    </td>
                    <td><code className="isbn-code">{book.isbn}</code></td>
                    <td><span className="category-tag">{book.category}</span></td>
                    <td>
                      <strong>{book.available}</strong> / {book.total}
                    </td>
                    <td>
                      <span className={`badge ${statusClass}`}>{statusText}</span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn-icon btn-icon--edit"
                          onClick={() => handleOpenEditModal(book)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn-icon btn-icon--delete"
                          onClick={() => handleDelete(book.id)}
                          title="Supprimer"
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
                  Aucun livre ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL AJOUT / ÉDITION */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentBook ? "Modifier le livre" : "Ajouter un livre"}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Titre de l'ouvrage</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ex: Le Petit Prince"
                />
              </div>

              <div className="form-group">
                <label>Auteur</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="ex: Antoine de Saint-Exupéry"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-..."
                  />
                </div>

                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.filter((c) => c !== "Toutes").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Exemplaires Totaux</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Exemplaires Disponibles</label>
                  <input
                    type="number"
                    min="0"
                    max={formData.total}
                    required
                    value={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: Number(e.target.value) })}
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
                  {currentBook ? "Enregistrer" : "Créer le livre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}