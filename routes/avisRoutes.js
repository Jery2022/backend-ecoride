import { Router } from "express";
import { body, param } from 'express-validator';
import { getAvis, getAllAvis, addAvis, updateAvis, deleteAvis } from "../controllers/avisControllers.js";
import { validateRequest, isAdmin } from "../utils/validation.js";
import { INVALID_ID_MESSAGE } from "../utils/messages.js";

const avisRouter = Router();

// Route pour ajouter un avis avec système de validation
avisRouter.post(
  "/ajouter-avis",  
  [
    body("commentaire")
      .isLength({ max: 100 })
      .withMessage("Le commentaire doit comprendre au plus caractères")
      .trim()
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
   [
    body("note")
      .isInt({ min: 1, max: 5 })
      .withMessage("La note doit être un entier entre 1 et 5")
      .trim()
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  addAvis,
);

// Route pour récupérer tous les avis
avisRouter.get("/avis", getAllAvis);

// Route pour récupérer un avis par ID avec validation de l'ID
avisRouter.get("/avis/:id",
    [
      param('id').isInt().withMessage(INVALID_ID_MESSAGE),
      validateRequest,
    ], getAvis
);

// Route pour mettre à jour un avis par son ID avec validation
avisRouter.put(
  "/modifier-avis/:id",
  [
    param("id").isInt().withMessage(INVALID_ID_MESSAGE),
    body("commentaire")
      .optional() // Le champ "commentaire" est facultatif
      .trim()
      .isLength({ max: 100 })
      .withMessage("Le commentaire de l'avis doit avoir au plus 100 caractères")
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  updateAvis,
);
 
// Route pour supprimer un avis par son ID avec validation de l'ID
avisRouter.delete("/supprimer-avis/:id",
   [
    param('id').isInt().withMessage(INVALID_ID_MESSAGE), 
    validateRequest,
   ], deleteAvis
);

export default avisRouter;
