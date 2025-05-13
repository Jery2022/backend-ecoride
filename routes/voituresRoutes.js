import { Router } from "express";
import { body, param } from 'express-validator';
import { getVoiture, getAllVoitures, addVoiture, updateVoiture, deleteVoiture } from "../controllers/voitureController.js";
import { validateRequest } from "../utils/validation.js";
import { INVALID_ID_MESSAGE } from "../utils/messages.js";

const voitureRouter = Router();

// Route pour ajouter une voiture avec système de validation
voitureRouter.post(
  "/ajouter-voiture",
  [
    body("modele")
      .isLength({ min: 3 })
      .withMessage("Le lmodèle de la voiture est requis avec au moins 3 caractères")
      .trim()
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  addVoiture,
);

// Route pour récupérer toutes les voitures
voitureRouter.get("/voiture", getAllVoitures);

// Route pour récupérer une voiture par ID avec validation de l'ID
voitureRouter.get("/voiture/:id",
    [
    param('id').isInt().withMessage(INVALID_ID_MESSAGE),
 validateRequest,
], getVoiture,
);

// Route pour mettre à jour une voiture par ID avec validation
voitureRouter.put(
  "/modifier-voiture/:id",
  [
    param("id").isInt().withMessage(INVALID_ID_MESSAGE),
    body("modele")
      .optional() // Le champ "modele" est facultatif
      .trim()
      .isLength({ min: 3 })
      .withMessage("Le modèle d'une voiture est requis avec au moins 3 caractères")
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  [
    body("immatriculation")
      .optional() // Le champ "immatriculation" est facultatif
      .trim()
      .isLength({ min: 10})
      .withMessage("L\'immatriculation d'une voiture est requis avec au moins 10 caractères")
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
   [
    body("energie")
      .optional() // Le champ "energie" est facultatif
      .trim()
      .isLength({ min: 3})
      .withMessage("L\'energie d'une voiture est requis avec au moins 3 caractères")
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  [
    body("couleur")
      .optional() // Le champ "couleur" est facultatif
      .trim()
      .isLength({ min: 3})
      .withMessage("La couleur d'une voiture est requis avec au moins 3 caractères")
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  updateVoiture,
);
 
// Route pour supprimer une voiture par son ID avec validation de l'ID
voitureRouter.delete("/supprimer-voiture/:id",
   [
    param('id').isInt().withMessage(INVALID_ID_MESSAGE),
    validateRequest,
   ], deleteVoiture 
);

export default voitureRouter;
