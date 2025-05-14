import { validationResult } from 'express-validator';
import { INVALID_ID_MESSAGE } from './messages.js';

// Fonction utilitaire pour valider les IDs
export const validateId = (id) => {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
        console.log(`ID invalide: ${id}`);
        throw new Error(INVALID_ID_MESSAGE);
    }
    return parsedId;
};

export const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Middleware pour gérer les erreurs de validation
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };