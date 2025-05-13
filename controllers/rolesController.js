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

// Création d'un nouveau rôle
export const addRole = async (req, res) => {
    const { libelle } = req.body;

    // Vérifier les erreurs de validation
    handleValidationErrors(req, res);

    try {
        const sql = 'INSERT INTO role (libelle) VALUES (?)';
        const result = await query(sql, [libelle]);
        res.status(201).json({message: DATA_ADDED_MESSAGE,  id: result.insertId, libelle: req.body.libelle });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du nouveau rôle : ', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};


// Lister tous les rôles
export const getAllRoles = async (req, res) => {
    const sql = 'SELECT * FROM role';
    try {
        const results = await query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des rôles :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};


// Récuperer un rôle par son ID
export const getRole = async (req, res) => {
    const id = validateId(req.params.id);
   
    try {
        const sql = 'SELECT * FROM role WHERE id_role = ?';
        const result = await query(sql, [id]);
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du rôle :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Mettre à jour un rôle par son ID
export const updateRole = async (req, res) => {
    const id = validateId(req.params.id);
   
    handleValidationErrors(req, res);  // Vérifier les erreurs de validation

    try {

        // Vérifier si le rôle à modifier existe avant de le mettre à jour
        const checkSql = 'SELECT * FROM role WHERE id_role = ?';
        const checkResult = await query(checkSql, [id]);
        if (checkResult.length === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE+' ID inexistant.' });
        }

        const sql = 'UPDATE role SET libelle = ? WHERE id_role = ?';
        const result = await query(sql, [req.body.libelle, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: DATA_UPDATED_MESSAGE, id: id, libelle: req.body.libelle });
        } else {
            res.status(404).json({ message: NO_DATA_TO_UPDATE_MESSAGE });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du rôle :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Supprimer un utilisateur par son ID
export const deleteRole = async (req, res) => {
    const id = validateId(req.params.id);

    const sql = 'DELETE  FROM role WHERE id_role = ?';
    try {
        const result = await query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' }); 
        }
        res.status(200).json({ message: DATA_DELETED_MESSAGE });
    } catch (err) {
        console.error('Erreur lors de la suppression du rôle :', err.message);
        res.status(500).send('Erreur lors de la suppression du rôle');
    }
};