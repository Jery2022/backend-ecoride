-- Table des images des voitures  
CREATE TABLE IF NOT EXISTS image_voiture (
   id_image_voiture INT AUTO_INCREMENT PRIMARY KEY,
   chemin_image VARCHAR(255) NOT NULL,
   id_voiture INT,  -- Lien vers la voiture
   FOREIGN KEY (id_voiture) REFERENCES voiture(id_voiture) ON DELETE CASCADE
) ENGINE=InnoDB; 