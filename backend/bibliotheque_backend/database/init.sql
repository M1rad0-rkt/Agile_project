CREATE TABLE admin (
    id_admin SERIAL PRIMARY KEY,
    nom VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE membre (
    id_membre SERIAL PRIMARY KEY,
    nom VARCHAR NOT NULL,
    prenom VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    date_inscription DATE NOT NULL
);

CREATE TABLE livre (
    id_livre SERIAL PRIMARY KEY,
    titre VARCHAR NOT NULL,
    auteur VARCHAR NOT NULL,
    categorie VARCHAR,
    exemplaire INTEGER NOT NULL
);

CREATE TABLE emprunt (
    id_emprunt SERIAL PRIMARY KEY,
    id_membre INTEGER NOT NULL,
    id_livre INTEGER NOT NULL,
    date_emprunt DATE NOT NULL,
    date_retour DATE,
    statut VARCHAR NOT NULL,

    CONSTRAINT fk_emprunt_membre
        FOREIGN KEY (id_membre)
        REFERENCES membre(id_membre),

    CONSTRAINT fk_emprunt_livre
        FOREIGN KEY (id_livre)
        REFERENCES livre(id_livre)
);