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
   credit DECIMAL(10,2) DEFAULT 20.00,
   isValid BOOLEAN DEFAULT FALSE,
   id_role INT DEFAULT 5,  
   date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE SET NULL
)ENGINE=InnoDB;

-- Table des configurations des covoiturages
CREATE TABLE IF NOT EXISTS configuration (
   id_configuration INT AUTO_INCREMENT PRIMARY KEY,
   id_utilisateur INT NOT NULL,
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table des paramètres de configuration des covoiturages
CREATE TABLE IF NOT EXISTS parametre (
   id_parametre INT AUTO_INCREMENT PRIMARY KEY,
   id_configuration INT NOT NULL,
   mode_conduite ENUM('Éco', 'Normal', 'Sport') NOT NULL,
   limite_vitesse INT NOT NULL,
   acceleration ENUM('Modérée', 'Normale', 'Rapide') NOT NULL,
   climatisation ENUM('Auto', 'Manuelle', 'Désactivée') NOT NULL,
   sieges_chauffants BOOLEAN NOT NULL,
   volume_musique ENUM('Faible', 'Modéré', 'Élevé') NOT NULL,
   aide_conduite BOOLEAN NOT NULL,
   freinage_urgence BOOLEAN NOT NULL,
   avertissement_voie BOOLEAN NOT NULL,
   recuperation_energie BOOLEAN NOT NULL,
   prechauffage BOOLEAN NOT NULL,
   itineraire_optimise BOOLEAN NOT NULL,
   nombre_passagers INT NOT NULL,
   espace_bagages BOOLEAN NOT NULL,
   partage_frais BOOLEAN NOT NULL,
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
   id_marque INT NOT NULL,
   id_utilisateur INT NOT NULL,
   FOREIGN KEY (id_marque) REFERENCES marque(id_marque) ON DELETE CASCADE,
   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;
 
-- Table des images des voitures  
CREATE TABLE IF NOT EXISTS image_voiture (
   id_image_voiture INT AUTO_INCREMENT PRIMARY KEY,
   chemin_image VARCHAR(255) NOT NULL,
   id_voiture INT,  -- Lien vers la voiture
   FOREIGN KEY (id_voiture) REFERENCES voiture(id_voiture) ON DELETE CASCADE
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
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
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


USE ecoride_db;

INSERT INTO `role` (`id_role`, `libelle`) VALUES
(1, 'ADMIN'),
(3, 'CONDUCTEUR'),
(2, 'EMPLOYE'),
(4, 'PASSAGER'),
(5, 'VISITEUR');


INSERT INTO `marque` (`id_marque`, `libelle`) VALUES
(1, 'Peugeot'),
(2, 'Renault'),
(3, 'Citroen'),
(4, 'Dacia'),
(5, 'Volkswagen'),
(6, 'Toyota');


INSERT INTO `utilisateur` (`id_utilisateur`, `nom`, `password`, `telephone`, `adresse`, `date_naissance`, `genre`, `pseudo`, `prenom`, `email`, `credit`, `isValid`, `id_role`, `date_creation`) VALUES
(1, 'josé', '$2b$10$GT6rYbLtk5aQqfBSSk34sejLsUO6aWVWKD5TW/1SRjg.k2r3GUR2i', '0645789123', NULL, NULL, NULL, 'josé', 'Piere', 'jose.pierre@ecoride.org', 20.00, 1, 1, '2025-05-21 08:46:35'),
(2, 'Lebosse', '$2b$10$YdgGtRzhl/KKgqvfczBra.HvACQh47D.mztjC6gcP568iFmY5PtAS', '0645789123', NULL, NULL, NULL, 'José', 'José', 'jose_lebosse@ecoride.com', 20.00, 0, 2, '2025-05-13 18:39:55'),
(3, 'pauline', '123456', NULL, NULL, NULL, NULL, NULL, 'nina', 'pauline.nina@yahoo.co', 20.00, 0, 3, '2025-05-05 15:43:12'),
(4, 'Angelique', 'test', '065147987', NULL, NULL, NULL, 'Bobo', 'Bonga', 'angelique@yahoo.org', 20.00, 0, 4, '2025-05-05 15:48:16'),
(5, 'Guimbi', '$2b$10$8OoObybp4sJosJ/HQ9bJ6euVfKR1jcLacOvi0zoaO4SDUBtxdGt3y', '0647987321', NULL, NULL, NULL, 'Guigui', 'Joseph', 'joseph.guimbi@ecoride.org', 20.00, 1, 2, '2025-05-22 14:09:13');


INSERT INTO `voiture` (`id_voiture`, `modele`, `immatriculation`, `energie`, `couleur`, `date_premiere_circulation`, `id_marque`, `id_utilisateur`) VALUES
(1, 'zetra', 'GT145LG147', 'diesel', 'blanche', '1985-03-13', 2, 2),
(2, 'ZX4', '14azertyphr', 'diesel', 'grise', '2010-12-13', 3, 2),
(3, 'Carina', 'LR1457GT', 'Hybrique', 'vert', '1998-07-25', 4, 3),
(4, 'santa fe', '14jdg200ht', 'electrique', 'rouge bourdeau', '2005-06-30', 6, 2),
(5, 'Luna', '14RT12GAT', 'ESSENCE', 'Bordeau', '2010-06-14', 2, 5),
(6, 'Stars', '369CD654RG', 'hybride', 'Rouge', '2005-08-25', 4, 3);


INSERT INTO `covoiturage` (`id_covoiturage`, `id_utilisateur`, `id_voiture`, `date_depart`, `heure_depart`, `lieu_depart`, `date_arrivee`, `heure_arrivee`, `lieu_arrivee`, `statut_covoiturage`, `nb_place`, `prix_personne_AS`, `prix_personne_AR`, `distance`, `emission_co2`, `fumeur`, `animal`, `stop_rafraichissement`, `places_disponibles`, `prix`, `date_creation`) VALUES
(1, 2, 2, '2025-01-12', '08:30:14', 'Le mans', '2025-01-12', '18:30:00', 'paris 13', 'En cours', 2, 12.00, 12.00, 140, 14, 0, 0, NULL, 4, 20.00, '2025-05-21'),
(2, 2, 4, '2025-01-12', '07:30:00', 'Lile', '2025-01-12', '18:30:00', 'Bordeaux', 'En cours', 2, 12.00, 12.00, 140, 14, 0, 0, NULL, 3, 30.00, '2025-05-21'),
(3, 2, 4, '2025-01-12', '07:30:00', 'Lile', '2025-01-12', '18:30:00', 'Bordeaux', 'En cours', 2, 12.00, 12.00, 140, 14, 0, 0, NULL, 3, 30.00, '2025-05-21');


INSERT INTO `avis` (`id_avis`, `id_utilisateur`, `id_covoiturage`, `commentaire`, `note`, `date_creation`, `isValid`) VALUES
(1, 4, 2, 'Super voyage !', 3, '2025-05-21 19:11:27', 0),
(2, 5, 1, 'Quelques soucis avec la voiture. Conducteur pas serviable.', 2, '2025-05-21 19:12:43', 0),
(3, 5, 3, 'Bonne continuation, service moyen à mon sens.', 3, '2025-05-21 19:13:46', 0),
(4, 2, 3, 'Je suis ravi de ce voyage !', 4, '2025-05-21 19:16:08', 0);

INSERT INTO `participe` (`id_utilisateur`, `id_covoiturage`) VALUES
(2, 1),
(3, 1),
(4, 2),
(4, 3);

  

