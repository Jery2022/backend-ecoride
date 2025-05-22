import connection from '../db/db.js';
import { promisify } from 'util';
import { validateId, handleValidationErrors } from '../utils/validation.js';
import {  
        NO_DATA_TO_UPDATE_MESSAGE,  
        SERVER_ERROR_MESSAGE,
        DATA_ADDED_MESSAGE,
        DATA_NOT_FOUND_MESSAGE,
        DATA_DELETED_MESSAGE,
        DATA_UPDATED_MESSAGE } from '../utils/messages.js';

// Convertir les méthodes de connexion en Promises 
const query = promisify(connection.query).bind(connection);

// Création d'une nouvelle voiture
export const addVoiture = async (req, res) => {
    const { 
        modele, 
        immatriculation, 
        energie, couleur, 
        date_premiere_circulation, 
        id_marque, id_utilisateur } = req.body;

    // Vérifier les erreurs de validation
    handleValidationErrors(req, res);

    try {
        const sql = 'INSERT INTO voiture (modele, immatriculation, energie, couleur, \
        date_premiere_circulation, \
        id_marque, id_utilisateur ) VALUES (?,?, ?, ?, ?, ?, ?)';

        const result = await query(sql, [modele, immatriculation, energie, couleur, 
            date_premiere_circulation, id_marque, id_utilisateur]);

        res.status(201).json({message: DATA_ADDED_MESSAGE,  id: result.insertId, modele: req.body.modele });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la nouvelle voiture : ', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};


// Lister toutes les voitures
export const getAllVoitures = async (req, res) => {
    const sql = 'SELECT * FROM voiture ORDER BY id_voiture ASC';

    try {
        const results = await query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des voitures :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};


// Récuperer une voiture par son ID
export const getVoiture = async (req, res) => {
    const id = validateId(req.params.id);
   
    try {
        const sql = 'SELECT * FROM voiture WHERE id_voiture = ?';
        const result = await query(sql, [id]);
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la voiture:', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Mettre à jour une voiture par son ID
export const updateVoiture = async (req, res) => {
    const id = validateId(req.params.id);
   
    handleValidationErrors(req, res);  // Vérifier les erreurs de validation

    try {

        // Vérifier si la voiture à modifier existe avant de la mettre à jour
        const checkSql = 'SELECT * FROM voiture WHERE id_voiture = ?';
        const checkResult = await query(checkSql, [id]);

        if (checkResult.length === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE+' ID inexistant.' });
        }

        const sql = 'UPDATE voiture SET modele = ?, \
                    immatriculation = ?, \
                    energie = ?, couleur = ?, \
                    date_premiere_circulation = ?, \
                    id_marque = ? \
                    WHERE id_voiture = ?';

        const result = await query(sql, [req.body.modele, 
                        req.body.immatriculation, 
                        req.body.energie,
                        req.body.couleur,
                        req.body.date_premiere_circulation,
                        req.body.id_marque,
                        id
                    ]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: DATA_UPDATED_MESSAGE, id: id, modele: req.body.modele });
        } else {
            res.status(404).json({ message: NO_DATA_TO_UPDATE_MESSAGE });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la voiture :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Supprimer une voiture par son ID
export const deleteVoiture = async (req, res) => {
    const id = validateId(req.params.id);

    const sql = 'DELETE  FROM voiture WHERE id_voiture = ?';
    try {
        const result = await query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' }); 
        }
        res.status(200).json({ message: DATA_DELETED_MESSAGE });
    } catch (err) {
        console.error('Erreur lors de la suppression de la voiture :', err.message);
        res.status(500).send('Erreur lors de la suppression de la voiture');
    }
};