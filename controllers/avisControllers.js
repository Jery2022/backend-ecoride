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

// Création d'un nouvel avis 
export const addAvis = async (req, res) => {
    const { id_utilisateur, id_covoiturage, commentaire, note } = req.body;

    // Vérifier les erreurs de validation
    handleValidationErrors(req, res);

    try {
        const sql = 'INSERT INTO avis (id_utilisateur, id_covoiturage, commentaire, note) VALUES (?, ?, ?, ?)';
        const result = await query(sql, [id_utilisateur, id_covoiturage, commentaire, note]);
        res.status(201).json({message: DATA_ADDED_MESSAGE,  id: result.insertId, name: req.body.commentaire });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du nouvel avis : ', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};


// Lister tous les avis
export const getAllAvis = async (req, res) => {
    const sql = 'SELECT * FROM avis ORDER BY id_avis DESC';
    try {
        const results = await query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des avis :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};


// Récuperer un avis par son ID
export const getAvis = async (req, res) => {
    const id = validateId(req.params.id);
   
    try {
        const sql = 'SELECT * FROM avis WHERE id_avis = ?';
        const result = await query(sql, [id]);
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'avis :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Mettre à jour un avis par son ID
export const updateAvis = async (req, res) => {
    const id = validateId(req.params.id);
     const { commentaire, note, isValid } = req.body;
   
    handleValidationErrors(req, res);  // Vérifier les erreurs de validation

    try {

        // Vérifier si l'avis à modifier existe avant de le mettre à jour
        const checkSql = 'SELECT * FROM avis WHERE id_avis = ?';
        const checkResult = await query(checkSql, [id]);
        if (checkResult.length === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE+' ID inexistant.' });
        }
        // vérification des entrées utilisateur
        if (commentaire && commentaire.length > 100) {
            return res.status(400).json({ message: 'Le commentaire doit avoir au plus 100 caractères.' });
        }
        if (note && (note < 1 || note > 5)) {
            return res.status(400).json({ message: 'La note doit être comprise entre 1 et 5.' });
        }

        const sql = 'UPDATE avis SET commentaire = ?, note = ?, isValid = ? WHERE id_avis = ?';
        const result = await query(sql, [commentaire, note, isValid, id]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ message: DATA_UPDATED_MESSAGE, id: id });
        } else {
            res.status(404).json({ message: NO_DATA_TO_UPDATE_MESSAGE });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du rôle :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Supprimer un avis par son ID
export const deleteAvis = async (req, res) => {
    const id = validateId(req.params.id);

    const sql = 'DELETE  FROM avis WHERE id_avis = ?';
    try {
        const result = await query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' }); 
        }
        res.status(200).json({ message: DATA_DELETED_MESSAGE });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'avis :', err.message);
        res.status(500).send('Erreur lors de la suppression d\'avis.');
    }
};