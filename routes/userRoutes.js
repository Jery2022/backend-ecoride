import { Router } from "express";
import { body, param, validationResult } from 'express-validator';
import { getUser, getAllUsers, addUser, updateUser, deleteUser } from "../controllers/userController.js";

const userRouter = Router();

// Middleware pour gérer les erreurs de validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


// Constantes pour les messages d'erreur et les longueurs
const MIN_NAME_LENGTH = 5;
const INVALID_EMAIL_MESSAGE = "Email invalide";
const NAME_LENGTH_MESSAGE = `Le nom doit contenir au moins ${MIN_NAME_LENGTH} caractères`;
const INVALID_ID_MESSAGE = "ID invalide";

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


// Route pour la page d'accueil de l'API
userRouter.get("/users", (req, res) => {
  res.send("Bienvenue sur l'API des utilisateurs.");
});

 

export default userRouter;
