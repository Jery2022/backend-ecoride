import { Router } from "express";
import { body, param } from 'express-validator';
import { getUser, getAllUsers, addUser, updateUser, deleteUser } from "../controllers/userController.js";
import { validateRequest } from "../utils/validation.js";
import { MIN_NAME_LENGTH, 
        NAME_LENGTH_MESSAGE, 
        INVALID_EMAIL_MESSAGE, 
        INVALID_ID_MESSAGE } from "../utils/messages.js";

const userRouter = Router();

// Route pour ajouter un utilisateur avec système de validation
userRouter.post(
  "/ajouter-utilisateur",
  [
    body("nom")
      .isLength({ min: MIN_NAME_LENGTH })
      .withMessage(NAME_LENGTH_MESSAGE)
      .trim()
      .escape(),
    body("email").isEmail().withMessage(INVALID_EMAIL_MESSAGE).normalizeEmail(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  addUser,
);



// Route pour récupérer tous les utilisateurs
userRouter.get("/utilisateurs", getAllUsers);

// Route pour récupérer un utilisateur par ID avec validation de l'ID
userRouter.get(
  "/utilisateur/:id",
  [
    param("id").isInt().withMessage(INVALID_ID_MESSAGE),
    validateRequest,
  ],
  getUser
);


// Route pour modifier un utilisateur par ID avec validation
userRouter.put(
  "/modifier-utilisateur/:id",
  [
    param("id").isInt().withMessage(INVALID_ID_MESSAGE),
    body("nom")
      .optional() // Le champ "nom" est facultatif
      .trim()
      .isLength({ min: MIN_NAME_LENGTH })
      .withMessage(NAME_LENGTH_MESSAGE)
      .escape(),
    body("email")
      .optional() // Le champ "email" est facultatif
      .trim()
      .isEmail()
      .withMessage(INVALID_EMAIL_MESSAGE)
      .normalizeEmail(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
  updateUser
);
 
// Route pour supprimer un utilisateur par ID avec validation de l'ID
userRouter.delete(
  "/supprimer-utilisateur/:id",
  [
    param("id").isInt().withMessage(INVALID_ID_MESSAGE),
    validateRequest,
  ],
  deleteUser
);

export default userRouter;
