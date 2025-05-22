import { Router } from "express";
import { body } from 'express-validator';
import { 
        getCovoiturage, 
        getAllCovoiturages, 
        addCovoiturage, 
        updateCovoiturage, 
        deleteCovoiturage,
        getCovoiturageByUserId, 
        countUsersByCovoiturage
    } from "../controllers/covoiturageController.js";

import { validateRequest } from "../utils/validation.js";

const covoiturageRouter = Router();

// Middleware pour valider les entrées
const validateCovoiturage = [
    body('id_utilisateur').isInt().withMessage('L\'ID utilisateur doit être un entier.'),
    body('id_voiture').isInt().withMessage('L\'ID voiture doit être un entier.'),
    body('date_depart').isDate().withMessage('La date de départ doit être une date valide.'),
    body('heure_depart').isString().withMessage('L\'heure de départ doit être une chaîne de caractères.'),
    body('lieu_depart').isString().isLength({ max: 255 }).withMessage('Le lieu de départ doit être une chaîne de caractères de 255 caractères maximum.'),
    body('date_arrivee').isDate().withMessage('La date d\'arrivée doit être une date valide.'),
    body('heure_arrivee').isString().withMessage('L\'heure d\'arrivée doit être une chaîne de caractères.'),
    body('lieu_arrivee').isString().isLength({ max: 255 }).withMessage('Le lieu d\'arrivée doit être une chaîne de caractères de 255 caractères maximum.'),
    body('statut_covoiturage').isString().isLength({ max: 50 }).withMessage('Le statut du covoiturage doit être une chaîne de caractères de 50 caractères maximum.'),
    body('nb_place').isInt({ min: 1, max: 10 }).withMessage('Le nombre de places doit être un entier positif et inférieur à 10.'),
    body('prix_personne_AS').isDecimal().withMessage('Le prix par personne aller simple doit être un nombre décimal.'),
    body('prix_personne_AR').isDecimal().withMessage('Le prix par personne aller retour doit être un nombre décimal.'),
    body('distance').isInt({ min: 0 }).withMessage('La distance doit être un entier positif.'),
    body('emission_co2').isInt({ min: 0 }).withMessage('L\'émission de CO2 doit être un entier positif.'),
    body('places_disponibles').isInt({ min: 1 }).withMessage('Les places disponibles doivent être un entier positif.'),
    body('prix').isDecimal().withMessage('Le prix doit être un nombre décimal.'),
];

// Routes pour le covoiturage
// Route pour ajouter un covoiturage avec validation
covoiturageRouter.post('/ajouter-covoiturage', validateCovoiturage, validateRequest, addCovoiturage);

// Route pour récupérer tous les covoiturages
covoiturageRouter.get('/covoiturages',validateRequest, getAllCovoiturages);

// Route pour récupérer un covoiturage spécifique par ID avec validation
covoiturageRouter.get('/covoiturage/:id', validateRequest, getCovoiturage);

// Route pour mettre à jour un covoiturage par ID avec validation
covoiturageRouter.put('/covoiturage/:id', validateCovoiturage, validateRequest, updateCovoiturage);

// Route pour supprimer un covoiturage par son ID avec validation
covoiturageRouter.delete('/covoiturage/:id', validateRequest, deleteCovoiturage);

// Route pour récuperer les covoiturages d'un utilisateur spécifique par ID
covoiturageRouter.get('/covoiturages/:id_utilisateur', validateRequest, getCovoiturageByUserId);

// Route pour compter le nombre d'utilisateurs par covoiturage
covoiturageRouter.get('/covoiturage/:id_covoiturage/utilisateurs', validateRequest, countUsersByCovoiturage);



export default covoiturageRouter;