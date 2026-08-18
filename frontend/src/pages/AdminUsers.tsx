import React, { useState } from "react";
import "./AdminUsers.css";

// Interface Utilisateur
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: "Adhérent" | "Bibliothécaire" | "Admin";
  password: string; // Mot de passe attribué par l'admin
  status: "Actif" | "Inactif";
  memberNumber: string;
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

const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="M11.5 11.5L20 3" />
    <path d="M16 7l2 2" />
    <path d="M18 5l2 2" />
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

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Fonction utilitaire pour générer un mot de passe sécurisé
const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

// Données initiales
const INITIAL_USERS: User[] = [
  { id: 1, fullName: "Alice Martin", email: "alice.martin@example.com", role: "Adhérent", password: "Password123!", status: "Actif", memberNumber: "BIB-2024-001" },
  { id: 2, fullName: "Thomas Dubois", email: "thomas.dubois@example.com", role: "Adhérent", password: "SecurePass88!", status: "Actif", memberNumber: "BIB-2024-002" },
  { id: 3, fullName: "Claire Bernard", email: "claire.b@example.com", role: "Bibliothécaire", password: "AdminPass2026!", status: "Actif", memberNumber: "STAFF-001" },
  { id: 4, fullName: "Lucas Petit", email: "lucas.petit@example.com", role: "Adhérent", password: "MonMotDePasse99", status: "Inactif", memberNumber: "BIB-2024-003" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("Tous");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<User | null>(null);

  // Formulaire Nouvel Utilisateur
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "Adhérent" as "Adhérent" | "Bibliothécaire" | "Admin",
    password: generateRandomPassword(),
  });

  // Nouveau mot de passe pour la réinitialisation
  const [newPasswordValue, setNewPasswordValue] = useState<string>("");
  const [showPasswordMap, setShowPasswordMap] = useState<{ [key: number]: boolean }>({});

  // Générer un mot de passe aléatoire dans le formulaire d'ajout
  const handleGeneratePasswordForNewUser = () => {
    setNewUser({ ...newUser, password: generateRandomPassword() });
  };

  // Soumission : Création d'un utilisateur par l'admin
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const createdUser: User = {
      id: Date.now(),
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      password: newUser.password,
      status: "Actif",
      memberNumber: `BIB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    };

    setUsers([createdUser, ...users]);
    setIsAddModalOpen(false);
    setNewUser({
      fullName: "",
      email: "",
      role: "Adhérent",
      password: generateRandomPassword(),
    });
  };

  // Ouvrir la modal de changement de mot de passe
  const handleOpenPasswordModal = (user: User) => {
    setSelectedUserForPassword(user);
    setNewPasswordValue(generateRandomPassword()); // Propose un mot de passe par défaut
    setIsPasswordModalOpen(true);
  };

  // Soumission : Mise à jour du mot de passe par l'admin
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForPassword) return;

    setUsers(
      users.map((u) =>
        u.id === selectedUserForPassword.id ? { ...u, password: newPasswordValue } : u
      )
    );

    alert(`Le mot de passe de ${selectedUserForPassword.fullName} a été mis à jour avec succès : ${newPasswordValue}`);
    setIsPasswordModalOpen(false);
    setSelectedUserForPassword(null);
  };

  // Basculer l'affichage du mot de passe dans le tableau
  const toggleShowPassword = (id: number) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Supprimer un utilisateur
  const handleDeleteUser = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // Filtrage
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.memberNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "Tous" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-users">
      {/* HEADER */}
      <header className="admin-users__header">
        <div>
          <h1 className="admin-users__title">Gestion des utilisateurs</h1>
          <p className="admin-users__subtitle">
            Créez des comptes, attribuez des mots de passe et gérez les accès
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon /> Créer un utilisateur
        </button>
      </header>

      {/* FILTRES & RECHERCHE */}
      <div className="admin-users__toolbar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="role-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="Tous">Tous les rôles</option>
          <option value="Adhérent">Adhérent</option>
          <option value="Bibliothécaire">Bibliothécaire</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* TABLEAU DES UTILISATEURS */}
      <div className="admin-users__table-container">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Matricule</th>
              <th>Rôle</th>
              <th>Mot de passe (Admin)</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info-cell">
                      <span className="user-name">{user.fullName}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="member-number">{user.memberNumber}</span>
                  </td>
                  <td>
                    <span className={`role-badge role-badge--${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="password-cell">
                      <span className="password-text">
                        {showPasswordMap[user.id] ? user.password : "••••••••••••"}
                      </span>
                      <button
                        type="button"
                        className="btn-eye"
                        onClick={() => toggleShowPassword(user.id)}
                        title={showPasswordMap[user.id] ? "Masquer" : "Afficher"}
                      >
                        {showPasswordMap[user.id] ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-icon btn-icon--key"
                        onClick={() => handleOpenPasswordModal(user)}
                        title="Changer le mot de passe"
                      >
                        <KeyIcon />
                      </button>
                      <button
                        className="btn-icon btn-icon--delete"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Supprimer l'utilisateur"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-state">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1 : CRÉATION D'UTILISATEUR (AVEC MOT DE PASSE DÉFINI PAR L'ADMIN) */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Créer un nouvel utilisateur</h2>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Jean Dupont"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Adresse e-mail</label>
                <input
                  type="email"
                  required
                  placeholder="ex: jean.dupont@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Rôle</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as "Adhérent" | "Bibliothécaire" | "Admin",
                    })
                  }
                >
                  <option value="Adhérent">Adhérent</option>
                  <option value="Bibliothécaire">Bibliothécaire</option>
                  <option value="Admin">Administrateur</option>
                </select>
              </div>

              {/* SECTION MOT DE PASSE ADMIN */}
              <div className="form-group highlight-box">
                <label>Mot de passe attribué par l'Admin</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={handleGeneratePasswordForNewUser}
                  >
                    Générer
                  </button>
                </div>
                <small className="help-text">
                  Transmettez ce mot de passe à l'utilisateur lors de la création de son compte.
                </small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  Créer l'utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2 : CHANGER LE MOT DE PASSE D'UN UTILISATEUR EXISTANT */}
      {isPasswordModalOpen && selectedUserForPassword && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Réinitialiser le mot de passe</h2>
              <button className="modal-close" onClick={() => setIsPasswordModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSaveNewPassword} className="modal-form">
              <p className="modal-description">
                Vous modifiez le mot de passe de : <strong>{selectedUserForPassword.fullName}</strong> ({selectedUserForPassword.email})
              </p>

              <div className="form-group highlight-box">
                <label>Nouveau mot de passe attribué</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    required
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => setNewPasswordValue(generateRandomPassword())}
                  >
                    Générer
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  Enregistrer le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}