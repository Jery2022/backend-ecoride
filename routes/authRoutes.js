import { Router } from "express";
import { body } from 'express-validator';
import { register, login  } from "../controllers/authController.js";
import { validateRequest } from "../utils/validation.js";
import { MIN_NAME_LENGTH, 
        NAME_LENGTH_MESSAGE, 
        INVALID_EMAIL_MESSAGE, 
    } from "../utils/messages.js";

const authRouter = Router();

authRouter.post('/register', 
  [
    body("nom")
      .isLength({ min: MIN_NAME_LENGTH })
      .withMessage(NAME_LENGTH_MESSAGE)
      .trim()
      .escape(),
    body("prenom")
      .isLength({ min: MIN_NAME_LENGTH })
      .withMessage(NAME_LENGTH_MESSAGE)
      .trim()
      .escape(),
    body("email").isEmail().withMessage(INVALID_EMAIL_MESSAGE).normalizeEmail(),
    validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
    register
);

authRouter.post('/login', 
    [
        body("email").isEmail().withMessage(INVALID_EMAIL_MESSAGE).normalizeEmail(),
        validateRequest, // Ajout du middleware pour gérer les erreurs
  ],
    login);

export default authRouter;