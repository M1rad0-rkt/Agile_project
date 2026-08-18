import React, { useState } from "react";
import "./UserProfile.css";

// Interface pour le profil utilisateur
export interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  memberNumber: string;
  memberSince: string;
  avatarUrl?: string;
}

// Interface pour un emprunt personnel
export interface PersonalBorrow {
  id: number;
  bookTitle: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  status: "En cours" | "En retard" | "Rendu";
}

// --- ICÔNES SVG ---
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

// Données initiales de test
const INITIAL_USER: UserProfileData = {
  fullName: "Alice Martin",
  email: "alice.martin@example.com",
  phone: "06 12 34 56 78",
  address: "12 Rue des Lilas, 75011 Paris",
  memberNumber: "BIB-2024-0089",
  memberSince: "15 Janvier 2024",
};

const USER_BORROWS: PersonalBorrow[] = [
  { id: 1, bookTitle: "Le Petit Prince", author: "Antoine de Saint-Exupéry", borrowDate: "2026-08-01", dueDate: "2026-08-15", status: "En retard" },
  { id: 2, bookTitle: "Dune", author: "Frank Herbert", borrowDate: "2026-08-10", dueDate: "2026-08-24", status: "En cours" },
];

export default function UserProfile() {
  const [user, setUser] = useState<UserProfileData>(INITIAL_USER);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfileData>(INITIAL_USER);

  // État du formulaire de changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Activer le mode édition
  const handleEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  // Enregistrer les modifications des infos personnelles
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
  };

  // Soumission du changement de mot de passe
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas." });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }

    setPasswordMsg({ type: "success", text: "Votre mot de passe a été mis à jour avec succès !" });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="user-profile">
      {/* HEADER PROFIL */}
      <div className="user-profile__header-card">
        <div className="user-profile__avatar">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="user-profile__header-info">
          <h1 className="user-profile__name">{user.fullName}</h1>
          <p className="user-profile__meta">
            Adhérent n° <strong>{user.memberNumber}</strong> • Membre depuis le {user.memberSince}
          </p>
        </div>
      </div>

      {/* STATISTIQUES RAPIDES */}
      <div className="user-profile__stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--indigo">
            <BookIcon />
          </div>
          <div>
            <span className="stat-card__value">2</span>
            <span className="stat-card__label">Emprunts en cours</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--emerald">
            <BookIcon />
          </div>
          <div>
            <span className="stat-card__value">14</span>
            <span className="stat-card__label">Livres lus au total</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--amber">
            <BookIcon />
          </div>
          <div>
            <span className="stat-card__value">1</span>
            <span className="stat-card__label">Réservation en attente</span>
          </div>
        </div>
      </div>

      <div className="user-profile__grid">
        {/* COLONNE GAUCHE : INFOS PERSONNELLES */}
        <div className="user-profile__card">
          <div className="card-header">
            <h2>Informations personnelles</h2>
            {!isEditing && (
              <button className="btn btn--outline" onClick={handleEdit}>
                <EditIcon /> Modifier
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="info-list">
              <div className="info-item">
                <UserIcon />
                <div>
                  <label>Nom complet</label>
                  <p>{user.fullName}</p>
                </div>
              </div>

              <div className="info-item">
                <MailIcon />
                <div>
                  <label>Adresse e-mail</label>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="info-item">
                <PhoneIcon />
                <div>
                  <label>Numéro de téléphone</label>
                  <p>{user.phone || "Non renseigné"}</p>
                </div>
              </div>

              <div className="info-item">
                <UserIcon />
                <div>
                  <label>Adresse postale</label>
                  <p>{user.address || "Non renseignée"}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveInfo} className="profile-form">
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Adresse e-mail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Adresse postale</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  <SaveIcon /> Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>

        {/* COLONNE DROITE : EMPRUNTS EN COURS & SÉCURITÉ */}
        <div className="user-profile__right-col">
          {/* CARTE EMPRUNTS EN COURS */}
          <div className="user-profile__card">
            <div className="card-header">
              <h2>Mes emprunts en cours</h2>
            </div>

            <div className="borrows-list">
              {USER_BORROWS.map((borrow) => (
                <div key={borrow.id} className="borrow-item">
                  <div className="borrow-item__details">
                    <span className="borrow-item__title">{borrow.bookTitle}</span>
                    <span className="borrow-item__author">{borrow.author}</span>
                    <span className="borrow-item__date">
                      Retour prévu : <strong>{borrow.dueDate}</strong>
                    </span>
                  </div>
                  <span
                    className={`badge ${
                      borrow.status === "En retard" ? "badge--danger" : "badge--info"
                    }`}
                  >
                    {borrow.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CARTE CHANGER DE MOT DE PASSE */}
          <div className="user-profile__card">
            <div className="card-header">
              <h2><LockIcon /> Sécurité & Mot de passe</h2>
            </div>

            {passwordMsg && (
              <div className={`alert alert--${passwordMsg.type}`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label>Mot de passe actuel</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn btn--primary full-width">
                Mettre à jour le mot de passe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}