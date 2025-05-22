import connection from '../db/db.js';
import { promisify } from 'util';
import { handleValidationErrors } from '../utils/validation.js';
import {  
        SERVER_ERROR_MESSAGE,
        DATA_ADDED_MESSAGE,
        DATA_NOT_FOUND_MESSAGE,
        DATA_DELETED_MESSAGE,
    } from '../utils/messages.js';

// Convertir les méthodes de connexion en Promises 
const query = promisify(connection.query).bind(connection);

// Ajouter une participation (utilisateur <-> covoiturage)
export const addParticipe = async (req, res) => {
    const { id_utilisateur, id_covoiturage } = req.body;

    // Vérifier les erreurs de validation
    handleValidationErrors(req, res);

    if (!id_utilisateur || !id_covoiturage) {
        return res.status(400).json({ message: "id_utilisateur et id_covoiturage sont requis." });
    }

    try {
        const sql = 'INSERT INTO participe (id_utilisateur, id_covoiturage) VALUES (?, ?)';
        await query(sql, [id_utilisateur, id_covoiturage]);
        res.status(201).json({ message: DATA_ADDED_MESSAGE, id_utilisateur, id_covoiturage });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: "Cette participation existe déjà." });
        } else {
            console.error('Erreur lors de l\'ajout de la participation : ', err.message);
            res.status(500).json({ message: SERVER_ERROR_MESSAGE });
        }
    }
};

// Lister toutes les participations
export const getAllParticipations = async (req, res) => {
    const sql = 'SELECT * FROM participe ORDER BY id_covoiturage ASC, id_utilisateur ASC';
    try {
        const results = await query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des participations :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

// Supprimer une participation
export const deleteParticipation = async (req, res) => {
    const { id_utilisateur, id_covoiturage } = req.body;

    if (!id_utilisateur || !id_covoiturage) {
        return res.status(400).json({ message: "id_utilisateur et id_covoiturage sont requis." });
    }

    const sql = 'DELETE FROM participe WHERE id_utilisateur = ? AND id_covoiturage = ?';
    try {
        const result = await query(sql, [id_utilisateur, id_covoiturage]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: DATA_NOT_FOUND_MESSAGE + ' Participation non trouvée.' });
        }
        res.status(200).json({ message: DATA_DELETED_MESSAGE });
    } catch (err) {
        console.error('Erreur lors de la suppression de la participation :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};