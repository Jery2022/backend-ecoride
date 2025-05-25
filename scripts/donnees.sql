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