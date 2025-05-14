import { Router } from "express";
import { body } from 'express-validator';
import { getParametre, getAllParametres, addParametre, updateParametre, deleteParametre } from "../controllers/parametreController.js";
//import { validateRequest } from "../utils/validation.js";

const parametreRouter = Router();


// Middleware pour valider les entrées
const validateParametre = [
    body('id_configuration').isInt().withMessage('L\'ID de configuration doit être un entier.'),
    body('mode_conduite').isIn(['Éco', 'Normal', 'Sport']).withMessage('Mode de conduite invalide.'),
    body('limite_vitesse').isInt({ min: 0 }).withMessage('La limite de vitesse doit être un entier positif.'),
    body('acceleration').isIn(['Modérée', 'Normale', 'Rapide']).withMessage('Accélération invalide.'),
    body('climatisation').isIn(['Auto', 'Manuelle', 'Désactivée']).withMessage('Climatisation invalide.'),
    body('sieges_chauffants').isBoolean().withMessage('Les sièges chauffants doivent être un booléen.'),
    body('volume_musique').isIn(['Faible', 'Modéré', 'Élevé']).withMessage('Volume de musique invalide.'),
    body('aide_conduite').isBoolean().withMessage('Aide à la conduite doit être un booléen.'),
    body('freinage_urgence').isBoolean().withMessage('Freinage d\'urgence doit être un booléen.'),
    body('avertissement_voie').isBoolean().withMessage('Avertissement de voie doit être un booléen.'),
    body('recuperation_energie').isBoolean().withMessage('Récupération d\'énergie doit être un booléen.'),
    body('prechauffage').isBoolean().withMessage('Préchauffage doit être un booléen.'),
    body('itineraire_optimise').isBoolean().withMessage('Itinéraire optimisé doit être un booléen.'),
    body('nombre_passagers').isInt({ min: 1 }).withMessage('Le nombre de passagers doit être un entier positif.'),
    body('espace_bagages').isBoolean().withMessage('Espace bagages doit être un booléen.'),
    body('partage_frais').isBoolean().withMessage('Partage des frais doit être un booléen.'),
];

// Route pour ajouter un paramètre avec validation
parametreRouter.post('/ajouter-parametre', validateParametre, addParametre);

// Route pour récupérer tous les paramètres
parametreRouter.get('/parametre', getAllParametres);

// Route pour récupérer un paramètre par ID avec validation de l'ID
parametreRouter.get('/parametre/:id',getParametre);   

// Route pour mettre à jour un paramètre par ID avec validation
parametreRouter.put('/parametre/:id', validateParametre, updateParametre);

// Route pour supprimer un paramètre par ID avec validation de l'ID
parametreRouter.delete('/parametre/:id',  deleteParametre); 


export default parametreRouter;