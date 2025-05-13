import { Router } from "express";
import { body, param } from 'express-validator';
import { getRole, getAllRoles, addRole, updateRole, deleteRole } from "../controllers/rolesController.js";
import { validateRequest } from "../utils/validation.js";
import { INVALID_ID_MESSAGE } from "../utils/messages.js";

const roleRouter = Router();

// Route pour ajouter un rôle avec système de validation
roleRouter.post(
  "/ajouter-role",
  [
    body("libelle")
      .isLength({ min: 4 })
      .withMessage("Le libellé du rôle est requis avec au moins 4 caractères")
      .trim()
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  addRole,
);

// Route pour récupérer tous les rôles
roleRouter.get("/roles", getAllRoles);

// Route pour récupérer un rôle par ID avec validation de l'ID
roleRouter.get("/role/:id",
    [
    param('id').isInt().withMessage(INVALID_ID_MESSAGE),
 validateRequest,
], getRole
);

// Route pour mettre à jour un rôle par ID avec validation
roleRouter.put(
  "/modifier-role/:id",
  [
    param("id").isInt().withMessage(INVALID_ID_MESSAGE),
    body("libelle")
      .optional() // Le champ "libelle" est facultatif
      .trim()
      .isLength({ min: 4 })
      .withMessage("Le libellé du rôle est requis avec au moins 4 caractères")
      .escape(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  updateRole,
);
 
// Route pour supprimer un rôle par ID avec validation de l'ID
roleRouter.delete("/supprimer-role/:id",
   [
    param('id').isInt().withMessage(INVALID_ID_MESSAGE),
    validateRequest,
   ], deleteRole
);

export default roleRouter;
