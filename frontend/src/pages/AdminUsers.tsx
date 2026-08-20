<<<<<<< HEAD
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

=======
import React, { useEffect, useState } from "react";
import "./AdminUsers.css";

// ============================================================
// TYPES
// ============================================================

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: "Adhérent" | "Admin";
  password: string;
  status: "Actif" | "Inactif";
  memberNumber: string;
}

// Format reçu depuis FastAPI
interface MembreAPI {
  id_membre: number;
  nom: string;
  prenom: string;
  email: string;
  date_inscription?: string | null;
}


// ============================================================
// CONFIGURATION API
// ============================================================

const API_URL = "http://localhost:8000";


// ============================================================
// ICÔNES SVG
// ============================================================

>>>>>>> 449a4cd (Modification)
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

<<<<<<< HEAD
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
=======
const KeyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="M11.5 11.5L20 3" />
    <path d="M16 7l2 2" />
    <path d="M18 5l2 2" />
>>>>>>> 449a4cd (Modification)
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

<<<<<<< HEAD
const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
=======
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

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.83 14.83a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);


// ============================================================
// GÉNÉRATION MOT DE PASSE
// ============================================================

const generateRandomPassword = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

>>>>>>> 449a4cd (Modification)
  let pass = "";

  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return pass;
};

<<<<<<< HEAD
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

  //  Chargement initial des membres depuis l'API
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
=======

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function AdminUsers() {

  // ----------------------------------------------------------
  // UTILISATEURS
  // ----------------------------------------------------------

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");


  // ----------------------------------------------------------
  // RECHERCHE / FILTRE
  // ----------------------------------------------------------

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  const [roleFilter, setRoleFilter] =
    useState<string>("Tous");


  // ----------------------------------------------------------
  // MODALES
  // ----------------------------------------------------------

  const [isAddModalOpen, setIsAddModalOpen] =
    useState<boolean>(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);

  const [selectedUserForPassword, setSelectedUserForPassword] =
    useState<User | null>(null);


  // ----------------------------------------------------------
  // FORMULAIRE NOUVEL UTILISATEUR
  // ----------------------------------------------------------

  const [newUser, setNewUser] = useState({

    nom: "",

    prenom: "",

    email: "",

    role: "Adhérent" as
      | "Adhérent"
      | "Admin",

    password: generateRandomPassword(),

  });


  // ----------------------------------------------------------
  // MOT DE PASSE
  // ----------------------------------------------------------

  const [newPasswordValue, setNewPasswordValue] =
    useState<string>("");

  const [showPasswordMap, setShowPasswordMap] =
    useState<{ [key: number]: boolean }>({});


  // ==========================================================
  // RÉCUPÉRER LE TOKEN
  // ==========================================================

  const getToken = (): string | null => {

    // Essaie plusieurs noms possibles
    // selon ton système de login.

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken")
    );

  };


  // ==========================================================
  // RÉCUPÉRER LES MEMBRES
  // ==========================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      setError("");


      const token = getToken();


      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };


      // Si un token existe,
      // on l'envoie au backend.

      if (token) {

        headers["Authorization"] =
          `Bearer ${token}`;

      }


      const response = await fetch(
        `${API_URL}/membres/`,
        {
          method: "GET",
          headers,
        }
      );


      // ------------------------------------------------------
      // GESTION 401
      // ------------------------------------------------------

      if (response.status === 401) {

        throw new Error(
          "401 - Vous devez être authentifié pour accéder aux membres."
        );

      }


      if (!response.ok) {

        throw new Error(
          `Erreur HTTP ${response.status}`
        );

      }


      const data: MembreAPI[] =
        await response.json();


      // ------------------------------------------------------
      // TRANSFORMATION API -> FRONTEND
      // ------------------------------------------------------

      const formattedUsers: User[] =
        data.map((membre) => ({

          id: membre.id_membre,

          fullName:
            `${membre.prenom} ${membre.nom}`,

          email:
            membre.email,

          // Pour le moment,
          // ton backend Membre ne semble pas
          // fournir le rôle.

          role: "Adhérent",

          // Le backend ne renvoie pas
          // le mot de passe.

          password: "",

          status: "Actif",

          memberNumber:
            `BIB-${new Date().getFullYear()}-${String(
              membre.id_membre
            ).padStart(3, "0")}`,

        }));


      setUsers(formattedUsers);


    } catch (err) {

      console.error(
        "Erreur récupération membres :",
        err
      );


      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError(
          "Impossible de récupérer les utilisateurs."
        );

      }

    } finally {

      setLoading(false);

>>>>>>> 449a4cd (Modification)
    }

  };

<<<<<<< HEAD
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
=======

  // ==========================================================
  // CHARGEMENT INITIAL
  // ==========================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // ==========================================================
  // CRÉER UN MEMBRE
  // ==========================================================

  const handleCreateUser = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    try {

      const token = getToken();


      const headers: HeadersInit = {
        "Content-Type":
          "application/json",
      };


      if (token) {

        headers["Authorization"] =
          `Bearer ${token}`;

      }


      const response = await fetch(
        `${API_URL}/membres/`,
        {
          method: "POST",

          headers,

          body: JSON.stringify({

            nom:
              newUser.nom,

            prenom:
              newUser.prenom,

            email:
              newUser.email,

            password:
              newUser.password,

            date_inscription:
              new Date()
                .toISOString()
                .split("T")[0],

          }),

        }
      );


      if (response.status === 401) {

        alert(
          "Vous devez être connecté pour créer un utilisateur."
        );

        return;

      }


      if (!response.ok) {

        let message =
          "Impossible de créer l'utilisateur.";

        try {

          const errorData =
            await response.json();

          console.error(
            "Erreur backend :",
            errorData
          );

          if (errorData.detail) {

            message =
              Array.isArray(
                errorData.detail
              )
                ? JSON.stringify(
                    errorData.detail
                  )
                : errorData.detail;

          }

        } catch {

          // Rien

        }


        throw new Error(message);

      }


      // ------------------------------------------------------
      // SUCCÈS
      // ------------------------------------------------------

      alert(
        "Utilisateur créé avec succès !"
      );


      // Fermer modal

      setIsAddModalOpen(false);


      // Réinitialiser

      setNewUser({

        nom: "",

        prenom: "",

        email: "",

        role: "Adhérent",

        password:
          generateRandomPassword(),

      });


      // Recharger depuis la base

      await fetchUsers();


    } catch (err) {

      console.error(err);


      alert(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création."
      );

    }

  };


  // ==========================================================
  // OUVRIR MODAL MOT DE PASSE
  // ==========================================================

  const handleOpenPasswordModal = (
    user: User
  ) => {

    setSelectedUserForPassword(user);

    setNewPasswordValue(
      generateRandomPassword()
    );

    setIsPasswordModalOpen(true);

  };


  // ==========================================================
  // MODIFIER MOT DE PASSE
  // ==========================================================

  const handleSaveNewPassword = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    if (!selectedUserForPassword) {

      return;

    }


    try {

      const token = getToken();


      const headers: HeadersInit = {
        "Content-Type":
          "application/json",
      };


      if (token) {

        headers["Authorization"] =
          `Bearer ${token}`;

      }


      const response = await fetch(

        `${API_URL}/membres/${selectedUserForPassword.id}`,

        {

          method: "PUT",

          headers,

          body: JSON.stringify({

            password:
              newPasswordValue,

          }),

        }

      );


      if (response.status === 401) {

        alert(
          "Vous devez être connecté."
        );

        return;

      }


      if (!response.ok) {

        throw new Error(
          `Erreur HTTP ${response.status}`
        );

      }


      alert(
        "Mot de passe modifié avec succès."
      );


      setIsPasswordModalOpen(false);

      setSelectedUserForPassword(null);


    } catch (err) {

      console.error(err);

      alert(
        "Impossible de modifier le mot de passe."
      );

    }

  };


  // ==========================================================
  // AFFICHER / CACHER MOT DE PASSE
  // ==========================================================

  const toggleShowPassword = (
    id: number
  ) => {

    setShowPasswordMap(
      (previous) => ({

        ...previous,

        [id]:
          !previous[id],

      })
    );

  };


  // ==========================================================
  // SUPPRIMER
  // ==========================================================

  const handleDeleteUser = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
      );


    if (!confirmed) {

      return;

    }


    try {

      const token = getToken();


      const headers: HeadersInit = {
        "Content-Type":
          "application/json",
      };


      if (token) {

        headers["Authorization"] =
          `Bearer ${token}`;

      }


      const response = await fetch(

        `${API_URL}/membres/${id}`,

        {

          method: "DELETE",

          headers,

        }

      );


      if (response.status === 401) {

        alert(
          "Vous devez être connecté."
        );

        return;

      }


      if (!response.ok) {

        throw new Error(
          `Erreur HTTP ${response.status}`
        );

      }


      // Supprimer du frontend

      setUsers(
        (previousUsers) =>
          previousUsers.filter(
            (user) =>
              user.id !== id
          )
      );


    } catch (err) {

      console.error(err);

      alert(
        "Impossible de supprimer l'utilisateur."
      );

    }

  };


  // ==========================================================
  // FILTRAGE
  // ==========================================================

  const filteredUsers =
    users.filter((user) => {

      const search =
        searchTerm.toLowerCase();


      const matchesSearch =

        user.fullName
          .toLowerCase()
          .includes(search)

        ||

        user.email
          .toLowerCase()
          .includes(search)

        ||

        user.memberNumber
          .toLowerCase()
          .includes(search);


      const matchesRole =
        roleFilter === "Tous" ||
        user.role === roleFilter;


      return (
        matchesSearch &&
        matchesRole
      );

    });


  // ==========================================================
  // RENDER
  // ==========================================================
>>>>>>> 449a4cd (Modification)

  return (

    <div className="admin-users">
<<<<<<< HEAD
=======


      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

>>>>>>> 449a4cd (Modification)
      <header className="admin-users__header">

        <div>
<<<<<<< HEAD
          <h1 className="admin-users__title">Gestion des membres</h1>
          <p className="admin-users__subtitle">Créez des comptes et attribuez des mots de passe</p>
        </div>
        <button className="btn btn--primary" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon /> Créer un membre
=======

          <h1 className="admin-users__title">

            Gestion des utilisateurs

          </h1>


          <p className="admin-users__subtitle">

            Créez des comptes, attribuez
            des mots de passe et gérez
            les accès

          </p>

        </div>


        <button
          className="btn btn--primary"
          onClick={() =>
            setIsAddModalOpen(true)
          }
        >

          <PlusIcon />

          Créer un utilisateur

>>>>>>> 449a4cd (Modification)
        </button>

      </header>

<<<<<<< HEAD
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
=======

      {/* ================================================== */}
      {/* ERREUR */}
      {/* ================================================== */}

      {error && (

        <div
          style={{
            padding: "12px",
            marginBottom: "15px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
          }}
        >

          {error}

        </div>

      )}


      {/* ================================================== */}
      {/* CHARGEMENT */}
      {/* ================================================== */}

      {loading ? (

        <div
          style={{
            padding: "30px",
            textAlign: "center",
          }}
        >

          Chargement des utilisateurs...

        </div>

      ) : (

        <>


          {/* ============================================== */}
          {/* FILTRES */}
          {/* ============================================== */}

          <div className="admin-users__toolbar">


            <div className="search-box">

              <SearchIcon />


              <input

                type="text"

                placeholder="Rechercher par nom, email ou numéro..."

                value={searchTerm}

                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }

              />

            </div>


            <select

              className="role-select"

              value={roleFilter}

              onChange={(e) =>
                setRoleFilter(
                  e.target.value
                )
              }

            >

              <option value="Tous">
                Tous les rôles
              </option>

              <option value="Adhérent">
                Adhérent
              </option>

              <option value="Admin">
                Admin
              </option>

            </select>

          </div>


          {/* ============================================== */}
          {/* TABLEAU */}
          {/* ============================================== */}

          <div className="admin-users__table-container">

            <table className="admin-users__table">

              <thead>

                <tr>

                  <th>
                    Utilisateur
                  </th>

                  <th>
                    Matricule
                  </th>

                  <th>
                    Rôle
                  </th>


                  <th className="text-right">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.length > 0 ? (

                  filteredUsers.map(
                    (user) => (

                      <tr
                        key={user.id}
                      >


                        {/* UTILISATEUR */}

                        <td>

                          <div className="user-info-cell">

                            <span className="user-name">

                              {user.fullName}

                            </span>


                            <span className="user-email">

                              {user.email}

                            </span>

                          </div>

                        </td>


                        {/* MATRICULE */}

                        <td>

                          <span className="member-number">

                            {user.memberNumber}

                          </span>

                        </td>


                        {/* RÔLE */}

                        <td>

                          <span
                            className={`role-badge role-badge--${user.role.toLowerCase()}`}
                          >

                            {user.role}

                          </span>

                        </td>





                        {/* ACTIONS */}

                        <td>

                          <div className="actions-cell">


                            <button

                              className="btn-icon btn-icon--key"

                              onClick={() =>
                                handleOpenPasswordModal(
                                  user
                                )
                              }

                              title="Changer le mot de passe"

                            >

                              <KeyIcon />

                            </button>


                            <button

                              className="btn-icon btn-icon--delete"

                              onClick={() =>
                                handleDeleteUser(
                                  user.id
                                )
                              }

                              title="Supprimer l'utilisateur"

                            >

                              <TrashIcon />

                            </button>


                          </div>

                        </td>


                      </tr>

                    )

                  )

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="empty-state"
                    >

                      Aucun utilisateur trouvé.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </>

      )}


      {/* ================================================== */}
      {/* MODAL CRÉATION */}
      {/* ================================================== */}

      {isAddModalOpen && (

        <div
          className="modal-overlay"
          onClick={() =>
            setIsAddModalOpen(false)
          }
        >

          <div
            className="modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            <div className="modal-header">

              <h2>
                Créer un nouvel utilisateur
              </h2>


              <button
                className="modal-close"
                onClick={() =>
                  setIsAddModalOpen(false)
                }
              >

                <CloseIcon />

              </button>

            </div>


            <form
              onSubmit={handleCreateUser}
              className="modal-form"
            >


              {/* NOM */}

              <div className="form-group">

                <label>
                  Nom
                </label>

                <input

                  type="text"

                  required

                  placeholder="ex: Dupont"

                  value={newUser.nom}

                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      nom:
                        e.target.value,
                    })
                  }

                />

              </div>


              {/* PRÉNOM */}

              <div className="form-group">

                <label>
                  Prénom
                </label>

                <input

                  type="text"

                  required

                  placeholder="ex: Jean"

                  value={
                    newUser.prenom
                  }

                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      prenom:
                        e.target.value,
                    })
                  }

                />

>>>>>>> 449a4cd (Modification)
              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Adresse e-mail
                </label>

                <input

                  type="email"

                  required

                  placeholder="ex: jean@example.com"

                  value={
                    newUser.email
                  }

                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      email:
                        e.target.value,
                    })
                  }

                />

              </div>


              {/* RÔLE */}

              <div className="form-group">

                <label>
                  Rôle
                </label>

                <select

                  value={
                    newUser.role
                  }

                  onChange={(e) =>
                    setNewUser({

                      ...newUser,

                      role:
                        e.target.value as
                          | "Adhérent"
                          | "Admin",

                    })
                  }

                >

                  <option value="Adhérent">
                    Adhérent
                  </option>

                  <option value="Admin">
                    Administrateur
                  </option>

                </select>

              </div>


              {/* MOT DE PASSE */}

              <div className="form-group highlight-box">

                <label>
                  Mot de passe attribué
                </label>


                <div className="input-with-button">

                  <input

                    type="text"

                    required

                    value={
                      newUser.password
                    }

                    onChange={(e) =>
                      setNewUser({

                        ...newUser,

                        password:
                          e.target.value,

                      })
                    }

                  />


                  <button

                    type="button"

                    className="btn btn--secondary btn--sm"

                    onClick={() =>
                      setNewUser({

                        ...newUser,

                        password:
                          generateRandomPassword(),

                      })
                    }

                  >

                    Générer

                  </button>

                </div>


                <small className="help-text">

                  Le mot de passe sera
                  envoyé au backend et
                  devra être hashé côté
                  serveur.

                </small>

              </div>


              {/* BOUTONS */}

              <div className="modal-actions">
<<<<<<< HEAD
                <button type="button" className="btn btn--secondary" onClick={() => setIsAddModalOpen(false)}>
=======

                <button

                  type="button"

                  className="btn btn--secondary"

                  onClick={() =>
                    setIsAddModalOpen(
                      false
                    )
                  }

                >

>>>>>>> 449a4cd (Modification)
                  Annuler

                </button>
<<<<<<< HEAD
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "Créer le membre"}
=======


                <button

                  type="submit"

                  className="btn btn--primary"

                >

                  Créer l'utilisateur

>>>>>>> 449a4cd (Modification)
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

<<<<<<< HEAD
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
=======

      {/* ================================================== */}
      {/* MODAL CHANGEMENT PASSWORD */}
      {/* ================================================== */}

      {isPasswordModalOpen &&
        selectedUserForPassword && (

          <div
            className="modal-overlay"
            onClick={() =>
              setIsPasswordModalOpen(
                false
              )
            }
          >

            <div
              className="modal-content"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              <div className="modal-header">

                <h2>
                  Réinitialiser le mot de passe
                </h2>


                <button

                  className="modal-close"

                  onClick={() =>
                    setIsPasswordModalOpen(
                      false
                    )
                  }

                >

                  <CloseIcon />

                </button>

              </div>


              <form

                onSubmit={
                  handleSaveNewPassword
                }

                className="modal-form"

              >


                <p className="modal-description">

                  Vous modifiez le mot de
                  passe de :{" "}

                  <strong>

                    {
                      selectedUserForPassword.fullName
                    }

                  </strong>

                  {" "}

                  (
                  {
                    selectedUserForPassword.email
                  }
                  )

                </p>


                <div className="form-group highlight-box">

                  <label>
                    Nouveau mot de passe
                  </label>


                  <div className="input-with-button">

                    <input

                      type="text"

                      required

                      value={
                        newPasswordValue
                      }

                      onChange={(e) =>
                        setNewPasswordValue(
                          e.target.value
                        )
                      }

                    />


                    <button

                      type="button"

                      className="btn btn--secondary btn--sm"

                      onClick={() =>
                        setNewPasswordValue(
                          generateRandomPassword()
                        )
                      }

                    >

                      Générer

                    </button>

                  </div>

                </div>


                <div className="modal-actions">

                  <button

                    type="button"

                    className="btn btn--secondary"

                    onClick={() =>
                      setIsPasswordModalOpen(
                        false
                      )
                    }

                  >

                    Annuler

                  </button>


                  <button

                    type="submit"

                    className="btn btn--primary"

                  >

                    Enregistrer le mot de passe

                  </button>

                </div>

              </form>

            </div>

>>>>>>> 449a4cd (Modification)
          </div>

        )}

    </div>

  );
<<<<<<< HEAD
}
=======

}
>>>>>>> 449a4cd (Modification)
