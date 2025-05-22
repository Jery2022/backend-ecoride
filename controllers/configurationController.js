import connection from '../db/db.js';
import { promisify } from 'util';
import { validateId } from '../utils/validation.js';
import { validationResult } from 'express-validator'; // Pour la validation des entrées
import {  
        SERVER_ERROR_MESSAGE,
        DATA_ADDED_MESSAGE,
        DATA_NOT_FOUND_MESSAGE,
        DATA_DELETED_MESSAGE,
    } from '../utils/messages.js';

// Convertir les méthodes de connexion en Promises 
const query = promisify(connection.query).bind(connection);

// Créer une nouvelle configuration
export const addConfiguration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id_utilisateur  = validateId(req.body.id_utilisateur); // Validation de l'ID utilisateur
    const sql = 'INSERT INTO configuration (id_utilisateur) VALUES (?)';

    try {
        const result = await query(sql, [id_utilisateur]); // Utilisation de requêtes préparées pour éviter les injections SQL
        console.error('Resultat de la requête:', result); // Log de la configuration ajoutée
        
        if (result.length > 0) {
            return res.status(409).json({ message: 'La configuration existe déjà pour cet utilisateur.' });
        }

        res.status(201).json({ message: DATA_ADDED_MESSAGE, id_configuration: result.insertId });
    } catch (error) {
        console.error('Erreur lors de la création de la configuration:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la configuration.', error: error.message });
    }
};

// Lire toutes les configurations
export const getAllConfiguration = async (req, res) => {
    try {
        const sql = 'SELECT * FROM configuration ORDER BY id_configuration ASC';
        const configurations = await query(sql);
        res.status(200).json(configurations);
    } catch (error) {
        console.error('Erreur lors de la récupération des configurations:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des configurations.', error: error.message });
    }
};

// Lire une configuration spécifique par son ID.
export const getConfiguration = async (req, res) => {
    const id = validateId(req.params.id); // Valider l'ID

    try {
        const sql = 'SELECT * FROM configuration WHERE id_configuration = ?';
        const configuration = await query(sql, [id]);
        if (configuration.length > 0) {
            res.status(200).json(configuration[0]);
        } else {
            res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE + ' ID inexistant.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la configuration:', error);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE, error: error.message });
    }
};


// Supprimer une configuration
export const deleteConfiguration = async (req, res) => {
    const { id } = validateId(req.params.id);

    try {
        const sql = 'DELETE FROM configuration WHERE id_configuration = ?';
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE +' ID inexistant.' });
        }
        res.status(200).json({ message:  DATA_DELETED_MESSAGE  });
    } catch (error) {
        console.error('Erreur lors de la suppression de la configuration:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la configuration.', error: error.message });
    }
};


