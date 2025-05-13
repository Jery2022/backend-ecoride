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

// Création d'une nouvelle marque
export const addMarque = async (req, res) => {
    const { libelle } = req.body;

    // Vérifier les erreurs de validation
    handleValidationErrors(req, res);

    try {
        const sql = 'INSERT INTO marque (libelle) VALUES (?)';
        const result = await query(sql, [libelle]);
        res.status(201).json({message: DATA_ADDED_MESSAGE,  id: result.insertId, name: req.body.libelle });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la nouvelle marque : ', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};


// Lister toutes les marques
export const getAllMarques = async (req, res) => {
    const sql = 'SELECT * FROM marque ORDER BY id_marque ASC';
    try {
        const results = await query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des marques :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};


// Récuperer une marque par son ID
export const getMarque = async (req, res) => {
    const id = validateId(req.params.id);
   
    try {
        const sql = 'SELECT * FROM marque WHERE id_marque = ?';
        const result = await query(sql, [id]);
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la marque :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Mettre à jour une marque par son ID
export const updateMarque = async (req, res) => {
    const id = validateId(req.params.id);
   
    handleValidationErrors(req, res);  // Vérifier les erreurs de validation

    try {

        // Vérifier si la marque à modifier existe avant de le mettre à jour
        const checkSql = 'SELECT * FROM marque WHERE id_marque = ?';
        const checkResult = await query(checkSql, [id]);
        if (checkResult.length === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE+' ID inexistant.' });
        }

        const sql = 'UPDATE marque SET libelle = ? WHERE id_marque = ?';
        const result = await query(sql, [req.body.libelle, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: DATA_UPDATED_MESSAGE, id: id, libelle: req.body.libelle });
        } else {
            res.status(404).json({ message: NO_DATA_TO_UPDATE_MESSAGE });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la marque :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Supprimer une marque par son ID
export const deleteMarque = async (req, res) => {
    const id = validateId(req.params.id);

    const sql = 'DELETE  FROM marque WHERE id_marque = ?';
    try {
        const result = await query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' }); 
        }
        res.status(200).json({ message: DATA_DELETED_MESSAGE });
    } catch (err) {
        console.error('Erreur lors de la suppression de la marque :', err.message);
        res.status(500).send('Erreur lors de la suppression de la marquee');
    }
};