import { Router } from "express";
import { body, param } from 'express-validator';
import { getAllParticipations, addParticipe, deleteParticipation } from "../controllers/participationController.js";
import { validateRequest } from "../utils/validation.js";
import { INVALID_ID_MESSAGE } from "../utils/messages.js";

const participationRouter = Router();

// Route pour ajouter un avis avec système de validation
participationRouter.post(
  "/ajouter-participation",
  [
    body("id_utilisateur")
      .isInt()
      .withMessage("L'ID doit être un nombre entier.")
      .trim()
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
   [
    body("id_covoiturage")
      .isInt()
      .withMessage("L'ID doit être un nombre entier.")
      .trim()
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  addParticipe,
);

// Route pour récupérer tous les avis
participationRouter.get("/participations", getAllParticipations);

// Route pour supprimer un avis par son ID avec validation de l'ID
participationRouter.delete("/supprimer-participation/:id",
   [
    param('id').isInt().withMessage(INVALID_ID_MESSAGE), 
    validateRequest,
   ], deleteParticipation
);

export default participationRouter;
