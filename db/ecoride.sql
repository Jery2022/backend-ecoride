CREATE DATABASE IF NOT EXISTS ecoride_db;
USE ecoride_db;

-- Table des rôles (exemple : admin, employe, passager, conducteur)
CREATE TABLE role (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE DEFAULT 'PASSAGER' 
);

-- Table des marques de voitures
CREATE TABLE marque (
    id_marque INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL UNIQUE
);


-- Table des configurations des voitures
CREATE TABLE configuration (
   id_configuration INT AUTO_INCREMENT PRIMARY KEY,
   id_utilisateur INT NOT NULL,
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table des paramètres  
CREATE TABLE parametre (
   id_parametre INT AUTO_INCREMENT PRIMARY KEY,
   propriete VARCHAR(50),
   valeur VARCHAR(50),
   id_configuration INT NOT NULL,
   FOREIGN KEY(id_configuration) REFERENCES configuration(id_configuration)
);

-- Table des images des voitures  
CREATE TABLE image_voiture (
   id_image_voiture INT AUTO_INCREMENT PRIMARY KEY,
  chemin_image VARCHAR(255) NOT NULL
);


-- Table des utilisateurs
CREATE TABLE utilisateur (
   id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
   nom VARCHAR(50) NOT NULL,
   password VARCHAR(255) NOT NULL,
   telephone VARCHAR(50),
   adresse VARCHAR(255),
   date_naissance VARCHAR(50),
   photo VARCHAR(255),
   pseudo VARCHAR(50),
   prenom VARCHAR(50) NOT NULL,
   email VARCHAR(255) NOT NULL,
   UNIQUE(email),
   id_role INT NOT NULL,
   date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE SET NULL
);


-- Table des voitures
CREATE TABLE voiture (
   id_voiture INT AUTO_INCREMENT PRIMARY KEY,
   modele VARCHAR(50) NOT NULL,
   immatriculation VARCHAR(50) NOT NULL,
   energie VARCHAR(50) NOT NULL,
   couleur VARCHAR(50) NOT NULL,
   date_premiere_circulation DATE NOT NULL,
   id_image_voiture INT NOT NULL,
   id_marque INT NOT NULL,
   id_utilisateur INT NOT NULL,
   UNIQUE(immatriculation),
   FOREIGN KEY(id_image_voiture) REFERENCES image_voiture(id_image_voiture) ON DELETE CASCADE,
   FOREIGN KEY(id_marque) REFERENCES marque(id_marque),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur)  
);


-- Table des covoiturages
CREATE TABLE covoiturage (
    id_covoiturage INT AUTO_INCREMENT PRIMARY KEY,
    id_conducteur INT NOT NULL,
    id_voiture INT NOT NULL,
    date_depart DATE,
    heure_depart TIME,
    lieu_départ VARCHAR(255),
    date_arrivee DATE,
    heure_arrivee TIME,
    lieu_arrivee VARCHAR(255),
    statut_covoiturage VARCHAR(50),
    nb_place INT,
    prix_personne_AS DECIMAL(15,2),
    prix_personne_AR DECIMAL(15,2),
    distance INT,
    emission_co2 INT,
    fumeur BOOLEAN,
    animal BOOLEAN,
    stop_rafraichissement BOOLEAN,
    places_disponibles INT NOT NULL CHECK (places_disponibles > 0),
    prix DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_conducteur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_voiture) REFERENCES voiture(id_voiture) ON DELETE CASCADE
);


-- Table des avis (donnés par les utilisateurs sur les covoiturages)
CREATE TABLE avis (
    id_avis INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    id_covoiturage INT,
    commentaire TEXT,
    note TINYINT CHECK (note BETWEEN 1 AND 5),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_covoiturage) REFERENCES covoiturage(id_covoiturage) ON DELETE CASCADE
);


-- Tables de relations   

CREATE TABLE possede(
   id_utilisateur INT,
   id_role INT,
   PRIMARY KEY(id_utilisateur, id_role),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur),
   FOREIGN KEY(id_role) REFERENCES role(id_role)
);

CREATE TABLE depose(
   id_utilisateur INT,
   id_avis INT,
   PRIMARY KEY(id_utilisateur, id_avis),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur),
   FOREIGN KEY(id_avis) REFERENCES avis(id_avis)
);

CREATE TABLE participe(
   id_utilisateur INT,
   id_covoiturage INT,
   PRIMARY KEY(id_utilisateur, id_covoiturage),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur),
   FOREIGN KEY(id_covoiturage) REFERENCES covoiturage(id_covoiturage)
);








