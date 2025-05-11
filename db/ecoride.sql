CREATE DATABASE IF NOT EXISTS ecoride_db;
USE ecoride_db;

-- Table des rôles (exemple : admin, employe, passager, conducteur)
CREATE TABLE IF NOT EXISTS role (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE DEFAULT 'PASSAGER' 
);

-- Table des marques de voitures
CREATE TABLE IF NOT EXISTS marque (
    id_marque INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL UNIQUE
);


 

-- Table des images des voitures  
CREATE TABLE IF NOT EXISTS image_voiture (
   id_image_voiture INT AUTO_INCREMENT PRIMARY KEY,
   chemin_image VARCHAR(255) NOT NULL
) ENGINE=InnoDB;   

   
-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateur (
   id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
   nom VARCHAR(50) NOT NULL,
   password VARCHAR(255) NOT NULL,
   telephone VARCHAR(50),
   adresse VARCHAR(255),
   date_naissance DATE,   
   genre VARCHAR(50),
   pseudo VARCHAR(50),
   prenom VARCHAR(50) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   id_role INT,   
   date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE SET NULL
)ENGINE=InnoDB;

-- Table des configurations des voitures
CREATE TABLE IF NOT EXISTS configuration (
   id_configuration INT AUTO_INCREMENT PRIMARY KEY,
   id_utilisateur INT NOT NULL,
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS parametre (
   id_parametre INT AUTO_INCREMENT PRIMARY KEY,
   propriete VARCHAR(50),
   valeur VARCHAR(50),
   id_configuration INT NOT NULL,
   FOREIGN KEY (id_configuration) REFERENCES configuration(id_configuration) ON DELETE CASCADE
) ENGINE=InnoDB;  


-- Table des voitures
CREATE TABLE IF NOT EXISTS voiture (
   id_voiture INT AUTO_INCREMENT PRIMARY KEY,
   modele VARCHAR(50) NOT NULL,
   immatriculation VARCHAR(50) NOT NULL UNIQUE,
   energie VARCHAR(50) NOT NULL,
   couleur VARCHAR(50) NOT NULL,
   date_premiere_circulation DATE NOT NULL,
   id_image_voiture INT NOT NULL,
   id_marque INT NOT NULL,
   id_utilisateur INT NOT NULL,
   FOREIGN KEY (id_image_voiture) REFERENCES image_voiture(id_image_voiture) ON DELETE CASCADE,
   FOREIGN KEY (id_marque) REFERENCES marque(id_marque) ON DELETE CASCADE,
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;   


-- Table des covoiturages
CREATE TABLE IF NOT EXISTS covoiturage (
    id_covoiturage INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT  NOT NULL,
    id_voiture INT  NOT NULL,
    date_depart DATE,
    heure_depart TIME,
    lieu_depart VARCHAR(255),
    date_arrivee DATE,
    heure_arrivee TIME,
    lieu_arrivee VARCHAR(255),
    statut_covoiturage VARCHAR(50),
    nb_place INT,
    prix_personne_AS DECIMAL(15,2),
    prix_personne_AR DECIMAL(15,2),
    distance INT,
    emission_co2 INT,
    fumeur BOOLEAN DEFAULT FALSE,
    animal BOOLEAN DEFAULT FALSE,
    stop_rafraichissement BOOLEAN DEFAULT FALSE,
    places_disponibles INT NOT NULL CHECK (places_disponibles > 0),
    prix DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_voiture) REFERENCES voiture(id_voiture) ON DELETE CASCADE,
    INDEX idx_utilisateur (id_utilisateur),   
    INDEX idx_voiture (id_voiture)            
) ENGINE=InnoDB;   


-- Table des avis (donnés par les utilisateurs sur les covoiturages)
CREATE TABLE IF NOT EXISTS avis (
    id_avis INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    id_covoiturage INT NOT NULL,
    commentaire VARCHAR(200),  -- Limitation de la longueur du commentaire
    note TINYINT CHECK (note BETWEEN 1 AND 5),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isValid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_covoiturage) REFERENCES covoiturage(id_covoiturage) ON DELETE CASCADE,
    INDEX idx_utilisateur (id_utilisateur),  -- Index pour améliorer les performances des requêtes
    INDEX idx_covoiturage (id_covoiturage)   -- Index pour améliorer les performances des requêtes
);

-- Table des messages
CREATE TABLE IF NOT EXISTS message (
   id_message INT AUTO_INCREMENT PRIMARY KEY,
   id_utilisateur INT NOT NULL, -- Utilisateur qui envoie le message
   id_avis INT NOT NULL,  -- Avis auquel le message est associé
   destinataire INT NOT NULL, -- Utilisateur destinataire du message
   sujet VARCHAR(30) NOT NULL,
   contenu TEXT NOT NULL,
   date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
   FOREIGN KEY (id_avis) REFERENCES avis(id_avis) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table des notifications
CREATE TABLE IF NOT EXISTS notification (
   id_notification INT AUTO_INCREMENT PRIMARY KEY,
   id_utilisateur INT NOT NULL,
   message VARCHAR(100) NOT NULL,
   date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   lu BOOLEAN DEFAULT FALSE,
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Table des issues des relations

CREATE TABLE IF NOT EXISTS possede (
   id_utilisateur INT NOT NULL,
   id_role INT NOT NULL,
   PRIMARY KEY (id_utilisateur, id_role),
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
   FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE CASCADE
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS depose (
   id_utilisateur INT NOT NULL,
   id_avis INT NOT NULL,
   PRIMARY KEY (id_utilisateur, id_avis),
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
   FOREIGN KEY (id_avis) REFERENCES avis(id_avis) ON DELETE CASCADE
) ENGINE=InnoDB;   

CREATE TABLE IF NOT EXISTS participe (
   id_utilisateur INT NOT NULL,
   id_covoiturage INT NOT NULL,
   PRIMARY KEY (id_utilisateur, id_covoiturage),
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
   FOREIGN KEY (id_covoiturage) REFERENCES covoiturage(id_covoiturage) ON DELETE CASCADE
) ENGINE=InnoDB;   


  



