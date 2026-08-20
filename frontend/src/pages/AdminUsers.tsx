import React, { useState, useEffect } from "react";
import "./AdminUsers.css";

export interface Membre {
  id_membre: number;
  nom: string;
  prenom: string;
  email: string;
  date_inscription: string;
}

const API_URL = "http://localhost:8000";

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

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

const authHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function AdminUsers() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [newMembre, setNewMembre] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: generateRandomPassword(),
    date_inscription: new Date().toISOString().split("T")[0],
  });

  const [selectedMembre, setSelectedMembre] = useState<Membre | null>(null);
  const [editMembre, setEditMembre] = useState({
    nom: "",
    prenom: "",
    email: "",
    date_inscription: "",
    password: "",
  });

  // 👇 Chargement initial des membres depuis l'API
  useEffect(() => {
    const fetchMembres = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_URL}/membres/`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.detail || `Erreur ${response.status}`);
        }

        const data: Membre[] = await response.json();
        setMembres(data);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Erreur lors du chargement des membres."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembres();
  }, []);

  const handleGeneratePassword = () => {
    setNewMembre({ ...newMembre, password: generateRandomPassword() });
  };

  const handleCreateMembre = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/membres/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(newMembre),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Erreur ${response.status}`);
      }

      const createdMembre: Membre = await response.json();
      setMembres([createdMembre, ...membres]);
      setIsAddModalOpen(false);
      setNewMembre({
        nom: "",
        prenom: "",
        email: "",
        password: generateRandomPassword(),
        date_inscription: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors de la création du membre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (membre: Membre) => {
    setSelectedMembre(membre);
    setEditMembre({
      nom: membre.nom,
      prenom: membre.prenom,
      email: membre.email,
      date_inscription: membre.date_inscription,
      password: "",
    });
    setErrorMessage("");
    setIsEditModalOpen(true);
  };

  const handleUpdateMembre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMembre) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload: Record<string, string> = {
        nom: editMembre.nom,
        prenom: editMembre.prenom,
        email: editMembre.email,
        date_inscription: editMembre.date_inscription,
      };
      if (editMembre.password.trim() !== "") {
        payload.password = editMembre.password;
      }

      const response = await fetch(`${API_URL}/membres/${selectedMembre.id_membre}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Erreur ${response.status}`);
      }

      const updatedMembre: Membre = await response.json();

      setMembres(
        membres.map((m) => (m.id_membre === updatedMembre.id_membre ? updatedMembre : m))
      );
      setIsEditModalOpen(false);
      setSelectedMembre(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors de la modification du membre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMembre = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) return;

    try {
      const response = await fetch(`${API_URL}/membres/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Erreur ${response.status}`);
      }

      setMembres(membres.filter((m) => m.id_membre !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression du membre.");
    }
  };

  const filteredMembres = membres.filter(
    (m) =>
      m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-users">
      <header className="admin-users__header">
        <div>
          <h1 className="admin-users__title">Gestion des membres</h1>
          <p className="admin-users__subtitle">Créez des comptes et attribuez des mots de passe</p>
        </div>
        <button className="btn btn--primary" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon /> Créer un membre
        </button>
      </header>

      <div className="admin-users__toolbar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {errorMessage && !isAddModalOpen && !isEditModalOpen && (
        <p className="error-text">{errorMessage}</p>
      )}

      <div className="admin-users__table-container">
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="empty-state">Chargement...</td>
              </tr>
            ) : filteredMembres.length > 0 ? (
              filteredMembres.map((membre) => (
                <tr key={membre.id_membre}>
                  <td>{membre.nom}</td>
                  <td>{membre.prenom}</td>
                  <td>{membre.email}</td>
                  <td>{membre.date_inscription}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-icon btn-icon--edit"
                        onClick={() => handleOpenEditModal(membre)}
                        title="Modifier le membre"
                      >
                      <EditIcon />
                      </button>
                      <button
                        className="btn-icon btn-icon--delete"
                        onClick={() => handleDeleteMembre(membre.id_membre)}
                        title="Supprimer le membre"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-state">Aucun membre trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Créer un nouveau membre</h2>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreateMembre} className="modal-form">
              {errorMessage && <p className="error-text">{errorMessage}</p>}

              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text" required placeholder="ex: Dupont"
                  value={newMembre.nom}
                  onChange={(e) => setNewMembre({ ...newMembre, nom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text" required placeholder="ex: Jean"
                  value={newMembre.prenom}
                  onChange={(e) => setNewMembre({ ...newMembre, prenom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Adresse e-mail</label>
                <input
                  type="email" required placeholder="ex: jean.dupont@example.com"
                  value={newMembre.email}
                  onChange={(e) => setNewMembre({ ...newMembre, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Date d'inscription</label>
                <input
                  type="date" required
                  value={newMembre.date_inscription}
                  onChange={(e) => setNewMembre({ ...newMembre, date_inscription: e.target.value })}
                />
              </div>

              <div className="form-group highlight-box">
                <label>Mot de passe attribué</label>
                <div className="input-with-button">
                  <input
                    type="text" required
                    value={newMembre.password}
                    onChange={(e) => setNewMembre({ ...newMembre, password: e.target.value })}
                  />
                  <button type="button" className="btn btn--secondary btn--sm" onClick={handleGeneratePassword}>
                    Générer
                  </button>
                </div>
                <small className="help-text">Transmettez ce mot de passe au membre.</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "Créer le membre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedMembre && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modifier le membre</h2>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleUpdateMembre} className="modal-form">
              {errorMessage && <p className="error-text">{errorMessage}</p>}

              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text" required
                  value={editMembre.nom}
                  onChange={(e) => setEditMembre({ ...editMembre, nom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text" required
                  value={editMembre.prenom}
                  onChange={(e) => setEditMembre({ ...editMembre, prenom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Adresse e-mail</label>
                <input
                  type="email" required
                  value={editMembre.email}
                  onChange={(e) => setEditMembre({ ...editMembre, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Date d'inscription</label>
                <input
                  type="date" required
                  value={editMembre.date_inscription}
                  onChange={(e) => setEditMembre({ ...editMembre, date_inscription: e.target.value })}
                />
              </div>

              <div className="form-group highlight-box">
                <label>Nouveau mot de passe (optionnel)</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Laisser vide pour ne pas changer"
                    value={editMembre.password}
                    onChange={(e) => setEditMembre({ ...editMembre, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => setEditMembre({ ...editMembre, password: generateRandomPassword() })}
                  >
                    Générer
                  </button>
                </div>
                <small className="help-text">
                  Laisse ce champ vide si tu ne veux pas changer le mot de passe.
                </small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setIsEditModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}