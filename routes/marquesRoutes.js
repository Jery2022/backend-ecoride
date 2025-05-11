import { Router } from "express";
import { body, param } from 'express-validator';
import { getMarque, getAllMarques, addMarque, updateMarque, deleteMarque } from "../controllers/marqueControllers.js";
import { validateRequest } from "../utils/validation.js";
import { INVALID_ID_MESSAGE } from "../utils/messages.js";

const marqueRouter = Router();

// Route pour ajouter une marque avec système de validation
marqueRouter.post(
  "/ajouter-marque",
  [
    body("libelle")
      .isLength({ min: 2 })
      .withMessage("Le libellé de la marque est requis avec au moins 2 caractères")
      .trim()
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  addMarque,
);

// Route pour récupérer toutes les marques
marqueRouter.get("/marque", getAllMarques);

// Route pour récupérer une marque par ID avec validation de l'ID
marqueRouter.get("/marque/:id",
    [
    param('id').isInt().withMessage(INVALID_ID_MESSAGE),
 validateRequest,
], getMarque,
);

// Route pour mettre à jour une marque par ID avec validation
marqueRouter.put(
  "/modifier-marque/:id",
  [
    param("id").isInt().withMessage(INVALID_ID_MESSAGE),
    body("libelle")
      .optional() // Le champ "libelle" est facultatif
      .trim()
      .isLength({ min: 2 })
      .withMessage("Le libellé d'une marque est requis avec au moins 2 caractères")
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  updateMarque,
);
 
// Route pour supprimer une marque par son ID avec validation de l'ID
marqueRouter.delete("/supprimer-marque/:id",
   [
    param('id').isInt().withMessage(INVALID_ID_MESSAGE),
    validateRequest,
   ], deleteMarque
);

export default marqueRouter;
