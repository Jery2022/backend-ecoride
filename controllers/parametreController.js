import connection from '../db/db.js';
import { validationResult } from 'express-validator';
import { promisify } from 'util';
import { validateId } from '../utils/validation.js';
/* import {  
        NO_DATA_TO_UPDATE_MESSAGE,  
        SERVER_ERROR_MESSAGE,
        DATA_ADDED_MESSAGE,
        DATA_NOT_FOUND_MESSAGE,
        DATA_DELETED_MESSAGE,
        DATA_UPDATED_MESSAGE } from '../utils/messages.js'; */

// Convertir les méthodes de connexion en Promises 
const query = promisify(connection.query).bind(connection);



// Fonction pour créer un nouveau paramètre
export const addParametre = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        id_configuration,
        mode_conduite,
        limite_vitesse,
        acceleration,
        climatisation,
        sieges_chauffants,
        volume_musique,
        aide_conduite,
        freinage_urgence,
        avertissement_voie,
        recuperation_energie,
        prechauffage,
        itineraire_optimise,
        nombre_passagers,
        espace_bagages,
        partage_frais,
    } = req.body;

    try {
        const sql = `INSERT INTO parametre (id_configuration, mode_conduite, limite_vitesse, acceleration, climatisation, 
            sieges_chauffants, volume_musique, aide_conduite, freinage_urgence, avertissement_voie, 
            recuperation_energie, prechauffage, itineraire_optimise, nombre_passagers, espace_bagages, 
            partage_frais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await query(
            sql,
            [
                id_configuration,
                mode_conduite,
                limite_vitesse,
                acceleration,
                climatisation,
                sieges_chauffants,
                volume_musique,
                aide_conduite,
                freinage_urgence,
                avertissement_voie,
                recuperation_energie,
                prechauffage,
                itineraire_optimise,
                nombre_passagers,
                espace_bagages,
                partage_frais,
            ]
        );
        res.status(201).json({ id_parametre: result.insertId, message: 'Paramètre créé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la création du paramètre:', error);
        res.status(500).json({ message: 'Erreur lors de la création du paramètre.', error: error.message });
    }
};

// Fonction pour lire tous les paramètres
export const getAllParametres = async (req, res) => {
    try {
        const sql = 'SELECT * FROM parametre';
        const parametres = await query(sql);
        res.status(200).json(parametres);
    } catch (error) {
        console.error('Erreur lors de la récupération des paramètres:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des paramètres.', error: error.message });
    }
};

// Fonction pour lire un paramètre spécifique (par son ID)
export const getParametre = async (req, res) => {
    const  id  = validateId(req.params.id);

    try {
        const sql = 'SELECT * FROM parametre WHERE id_parametre = ?';
        const parametre = await query(sql, [id]);
        if (parametre.length === 0) {
            return res.status(404).json({ message: 'Paramètre non trouvé.' });
        }
        res.status(200).json(parametre[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du paramètre:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du paramètre.', error: error.message });
    }
};

// Fonction pour mettre à jour un paramètre
export const updateParametre = async (req, res) => {
    const id  = validateId(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        id_configuration,
        mode_conduite,
        limite_vitesse,
        acceleration,
        climatisation,
        sieges_chauffants,
        volume_musique,
        aide_conduite,
        freinage_urgence,
        avertissement_voie,
        recuperation_energie,
        prechauffage,
        itineraire_optimise,
        nombre_passagers,
        espace_bagages,
        partage_frais,
    } = req.body;

    try {
        const sql = `UPDATE parametre SET id_configuration = ?, mode_conduite = ?, limite_vitesse = ?, acceleration = ?, 
            climatisation = ?, sieges_chauffants = ?, volume_musique = ?, aide_conduite = ?, freinage_urgence = ?, 
            avertissement_voie = ?, recuperation_energie = ?, prechauffage = ?, itineraire_optimise = ?, 
            nombre_passagers = ?, espace_bagages = ?, partage_frais = ? WHERE id_parametre = ?`;

        const result = await query(
            sql,
            [
                id_configuration,
                mode_conduite,
                limite_vitesse,
                acceleration,
                climatisation,
                sieges_chauffants,
                volume_musique,
                aide_conduite,
                freinage_urgence,
                avertissement_voie,
                recuperation_energie,
                prechauffage,
                itineraire_optimise,
                nombre_passagers,
                espace_bagages,
                partage_frais,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Paramètre non trouvé.' });
        }
        res.status(200).json({ message: 'Paramètre mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du paramètre:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du paramètre.', error: error.message });
    }
};

// Supprimer un paramètre
export const deleteParametre = async (req, res) => {
    const  id  = validateId(req.params.id);

    try {
        const sql = 'DELETE FROM parametre WHERE id_parametre = ?';
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Paramètre non trouvé.' });
        }
        res.status(200).json({ message: 'Paramètre supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du paramètre:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du paramètre.', error: error.message });
    }
};


