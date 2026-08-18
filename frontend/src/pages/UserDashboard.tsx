import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";




// 1. Les icônes sont maintenant des composants fonctionnels (ajout de () => )
const BookIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const borrowedBooks = [
  {
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    borrowDate: "10 août 2026",
    returnDate: "24 août 2026",
    status: "À rendre bientôt",
  },
  {
    title: "L'Étranger",
    author: "Albert Camus",
    borrowDate: "5 août 2026",
    returnDate: "28 août 2026",
    status: "En cours",
  },
  {
    title: "Les Misérables",
    author: "Victor Hugo",
    borrowDate: "1 août 2026",
    returnDate: "30 août 2026",
    status: "En cours",
  },
];

const recommendedBooks = [
  {
    title: "1984",
    author: "George Orwell",
  },
  {
    title: "Le Comte de Monte-Cristo",
    author: "Alexandre Dumas",
  },
  {
    title: "Notre-Dame de Paris",
    author: "Victor Hugo",
  },
  {
    title: "L'Alchimiste",
    author: "Paulo Coelho",
  },
];

function StatCard({
  icon,
  value,
  label,
  type = "blue",
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  type?: "blue" | "orange" | "red" | "green";
}) {
  return (
    <div className="user-stat-card">
      <div className={`user-stat-card__icon user-stat-card__icon--${type}`}>
        {icon}
      </div>

      <div>
        <p className="user-stat-card__value">{value}</p>
        <p className="user-stat-card__label">{label}</p>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="user-dashboard">
      <div className="user-dashboard__header">
        <div>
          <h1>Bonjour, Utilisateur</h1>
          <p>Voici un aperçu de votre activité à la bibliothèque.</p>
        </div>

        <div className="user-avatar">U</div>
      </div>

      <section className="user-stats">
        {/* 2. Les icônes sont appelées comme des composants <NomIcone /> */}
        <StatCard
          icon={<BookIcon />}
          value={3}
          label="Livres empruntés"
          type="blue"
        />

        <StatCard
          icon={<ClockIcon />}
          value={1}
          label="À rendre bientôt"
          type="orange"
        />

        <StatCard
          icon={<HeartIcon />}
          value={8}
          label="Mes favoris"
          type="red"
        />

        <StatCard
          icon={<CheckIcon />}
          value={12}
          label="Emprunts terminés"
          type="green"
        />
      </section>

      <section className="user-section">
        <div className="user-section__header">
          <div>
            <h2>Mes emprunts en cours</h2>
            <p>Les livres que vous avez actuellement empruntés.</p>
          </div>

          <button className="user-section__link">Voir tout</button>
        </div>

        <div className="borrowed-books">
          {borrowedBooks.map((book) => (
            <div className="borrowed-book" key={book.title}>
              <div className="borrowed-book__cover">
                <BookIcon />
              </div>

              <div className="borrowed-book__info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>

                <div className="borrowed-book__dates">
                  <span>
                    Emprunt : <strong>{book.borrowDate}</strong>
                  </span>

                  <span>
                    Retour : <strong>{book.returnDate}</strong>
                  </span>
                </div>
              </div>

              <div className="borrowed-book__right">
                <span
                  className={
                    book.status === "À rendre bientôt"
                      ? "book-status book-status--warning"
                      : "book-status"
                  }
                >
                  {book.status}
                </span>

                <button className="book-button">Voir le livre</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="user-section">
        <div className="user-section__header">
          <div>
            <h2>Livres recommandés</h2>
            <p>Découvrez de nouveaux livres qui pourraient vous intéresser.</p>
          </div>

          <button className="user-section__link">
          Voir le catalogue</button>
        </div>

        <div className="recommended-books">
          {recommendedBooks.map((book) => (
            <div className="recommended-book" key={book.title}>
              <div className="recommended-book__cover">
                <BookIcon />
              </div>

              <div className="recommended-book__info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>

              <button className="favorite-button">♡</button>

              <button className="borrow-button">Emprunter</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}