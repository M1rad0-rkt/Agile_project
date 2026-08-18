import React, { useState } from "react";
import "./BookCatalogue.css";

// --- ICÔNES ---
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

// --- DONNÉES FICTIVES ---
const CATEGORIES = ["Tous", "Roman", "Science-Fiction", "Fantaisie", "Classique", "Jeunesse"];

const MOCK_BOOKS = [
  { id: 1, title: "1984", author: "George Orwell", category: "Science-Fiction", available: true },
  { id: 2, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", category: "Jeunesse", available: false },
  { id: 3, title: "Dune", author: "Frank Herbert", category: "Science-Fiction", available: true },
  { id: 4, title: "L'Étranger", author: "Albert Camus", category: "Classique", available: false },
  { id: 5, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", category: "Fantaisie", available: true },
  { id: 6, title: "L'Alchimiste", author: "Paulo Coelho", category: "Roman", available: true },
  { id: 7, title: "Harry Potter à l'école des sorciers", author: "J.K. Rowling", category: "Fantaisie", available: true },
  { id: 8, title: "Les Misérables", author: "Victor Hugo", category: "Classique", available: false },
];

export default function BookCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Logique de filtrage
  const filteredBooks = MOCK_BOOKS.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Tous" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <h1>Catalogue de la bibliothèque </h1>
        <p>Explorez notre collection et trouvez votre prochaine lecture.</p>
      </header>

      {/* SECTION RECHERCHE ET FILTRES */}
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
          {CATEGORIES.map((category) => (
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

      {/* GRILLE DES LIVRES */}
      <section className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-card__cover">
                <BookIcon />
              </div>
              <div className="book-card__content">
                <span className="book-card__category">{book.category}</span>
                <h3 className="book-card__title">{book.title}</h3>
                <p className="book-card__author">{book.author}</p>
                
                <div className="book-card__footer">
                  <span className={`status-badge ${book.available ? "status--available" : "status--unavailable"}`}>
                    {book.available ? "Disponible" : "Emprunté"}
                  </span>
                  
                  <button 
                    className="action-btn" 
                    disabled={!book.available}
                  >
                    {book.available ? "Emprunter" : "Indisponible"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>Aucun livre ne correspond à votre recherche. 😥</p>
          </div>
        )}
      </section>
    </div>
  );
}