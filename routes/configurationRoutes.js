import { Router } from "express";
import { body, param } from 'express-validator';
import { getConfiguration, getAllConfiguration, addConfiguration, deleteConfiguration } from "../controllers/configurationController.js";
import { validateRequest } from "../utils/validation.js";

const configurationRouter = Router();
// import { validationResult, body } from 'express-validator'; // Pour la validation des entrées


// Middleware pour valider les entrées
const validateConfiguration = [
    body('id_utilisateur')
    .isInt()
    .withMessage('L\'ID utilisateur doit être un entier.')
    .trim()
    .escape(),
    body('id_configuration')
    .isInt()
    .withMessage('L\'ID de la configuration doit être un entier.')
    .trim()
    .escape(),
    validateRequest, // Middleware pour gérer les erreurs de validation
];

// Route pour ajouter une configuration avec validation
configurationRouter.post(
    "/ajouter-config", 
    validateConfiguration,
    addConfiguration, // Controller pour ajouter une configuration
); 

// Route pour récupérer toutes les configurations
configurationRouter.get(
    "/configurations",
    getAllConfiguration, // Controller pour récupérer toutes les configurations
);

// Route pour récupérer une configuration par ID avec validation de l'ID
configurationRouter.get(
    "/configuration/:id",
    [
        param('id').isInt().withMessage('L\'ID utilisateur doit être un entier.'),
        validateRequest,
    ], 
    getConfiguration, // Controller pour récupérer une configuration par ID
);

// Route pour supprimer une configuration par son ID avec validation de l'ID
configurationRouter.delete(
    "/supprimer-config/:id",
    [
        param('id').isInt().withMessage('L\'ID utilisateur doit être un entier.'),
        validateRequest,
    ], 
    deleteConfiguration 
);

export default configurationRouter;