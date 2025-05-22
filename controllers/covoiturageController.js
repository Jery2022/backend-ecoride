import connection from '../db/db.js';
import { promisify } from 'util';
import { validateId, formatTime  } from '../utils/validation.js';
import { validationResult } from 'express-validator'; // Pour la validation des entrées

 

// Convertir les méthodes de connexion en Promises 
const query = promisify(connection.query).bind(connection);
 

// Créer un nouveau covoiturage
export const addCovoiturage = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        id_utilisateur,
        id_voiture,
        date_depart,
        heure_depart,
        lieu_depart,
        date_arrivee,
        heure_arrivee,
        lieu_arrivee,
        statut_covoiturage,
        nb_place,
        prix_personne_AS,
        prix_personne_AR,
        distance,
        emission_co2,
        fumeur,
        animal,
        stop_rafraichissement,
        places_disponibles,
        prix,
    } = req.body;

    // Formater les heures
    const formattedHeureDepart = formatTime(heure_depart);
    const formattedHeureArrivee = formatTime(heure_arrivee);

    try {
        // Vérifier les clés étrangères
        const utilisateurExists = await query('SELECT 1 FROM utilisateur WHERE id_utilisateur = ?', [id_utilisateur]);
        if (utilisateurExists.length === 0) {
            return res.status(400).json({ message: 'Utilisateur non trouvé.' });
        }

        const voitureExists = await query('SELECT 1 FROM voiture WHERE id_voiture = ?', [id_voiture]);
        if (voitureExists.length === 0) {
            return res.status(400).json({ message: 'Voiture non trouvée.' });
        }

        // Requête d'insertion
        const sql = `INSERT INTO covoiturage (id_utilisateur, id_voiture, date_depart, heure_depart, lieu_depart, 
            date_arrivee, heure_arrivee, lieu_arrivee, statut_covoiturage, nb_place, prix_personne_AS, 
            prix_personne_AR, distance, emission_co2, fumeur, animal, stop_rafraichissement, 
            places_disponibles, prix) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await query(
            sql,
            [
                id_utilisateur,
                id_voiture,
                date_depart,
                formattedHeureDepart,
                lieu_depart,
                date_arrivee,
                formattedHeureArrivee,
                lieu_arrivee,
                statut_covoiturage,
                nb_place,
                prix_personne_AS,
                prix_personne_AR,
                distance,
                emission_co2,
                fumeur,
                animal,
                stop_rafraichissement,
                places_disponibles,
                prix,
            ]
        );

        console.log('Covoiturage créé avec succès:', result.insertId);
        res.status(201).json({ id_covoiturage: result.insertId, message: 'Covoiturage créé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la création du covoiturage:', error);
        res.status(500).json({ message: 'Erreur lors de la création du covoiturage.', error: error.sqlMessage || error.message });
    }
};

// Fonction pour lire tous les covoiturages
export const getAllCovoiturages = async (req, res) => {
    try {
        const covoiturages = await query('SELECT * FROM covoiturage');
        res.status(200).json(covoiturages);
    } catch (error) {
        console.error('Erreur lors de la récupération des covoiturages:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des covoiturages.', error: error.message });
    }
};

// Fonction pour lire un covoiturage spécifique par son ID
export const getCovoiturage = async (req, res) => {
    const id  = validateId(req.params.id);

    try {
        const sql = 'SELECT * FROM covoiturage WHERE id_covoiturage = ?';
        const covoiturage = await query(sql, [id]);

        if (covoiturage.length === 0) {
            return res.status(404).json({ message: 'Covoiturage non trouvé.' });
        }
        res.status(200).json(covoiturage[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du covoiturage:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du covoiturage.', error: error.message });
    }
};

// Fonction pour mettre à jour un covoiturage
export const updateCovoiturage = async (req, res) => {
    const  id  = validateId(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        id_utilisateur,
        id_voiture,
        date_depart,
        heure_depart,
        lieu_depart,
        date_arrivee,
        heure_arrivee,
        lieu_arrivee,
        statut_covoiturage,
        nb_place,
        prix_personne_AS,
        prix_personne_AR,
        distance,
        emission_co2,
        fumeur,
        animal,
        stop_rafraichissement,
        places_disponibles,
        prix,
    } = req.body;

    try {
        const sql = `UPDATE covoiturage SET id_utilisateur = ?, id_voiture = ?, date_depart = ?, heure_depart = ?, 
            lieu_depart = ?, date_arrivee = ?, heure_arrivee = ?, lieu_arrivee = ?, statut_covoiturage = ?, 
            nb_place = ?, prix_personne_AS = ?, prix_personne_AR = ?, distance = ?, emission_co2 = ?, 
            fumeur = ?, animal = ?, stop_rafraichissement = ?, places_disponibles = ?, prix = ? 
            WHERE id_covoiturage = ?`;

        const result = await query(
           sql,
            [
                id_utilisateur,
                id_voiture,
                date_depart,
                heure_depart,
                lieu_depart,
                date_arrivee,
                heure_arrivee,
                lieu_arrivee,
                statut_covoiturage,
                nb_place,
                prix_personne_AS,
                prix_personne_AR,
                distance,
                emission_co2,
                fumeur,
                animal,
                stop_rafraichissement,
                places_disponibles,
                prix,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Covoiturage non trouvé.' });
        }
        res.status(200).json({ message: 'Covoiturage mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du covoiturage:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du covoiturage.', error: error.message });
    }
};

// Fonction pour supprimer un covoiturage
export const deleteCovoiturage = async (req, res) => {
    const  id  = validateId(req.params.id);

    try {
        const sql = 'DELETE FROM covoiturage WHERE id_covoiturage = ?'
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Covoiturage non trouvé.' });
        }
        res.status(200).json({ message: 'Covoiturage supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du covoiturage:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du covoiturage.', error: error.message });
    }
};


// Fonction pour compter le nombre d'utilisateurs par covoiturage
export const countUsersByCovoiturage = async (req, res) => {
    try {
        const sql = `SELECT id_covoiturage, COUNT(*) AS nombre_utilisateurs
                     FROM utilisateurs
                     GROUP BY id_covoiturage`;
        const result = await query(sql);
        res.status(200).json(result);
    } catch (error) {
        console.error('Erreur lors du comptage des utilisateurs par covoiturage:', error);
        res.status(500).json({ message: 'Erreur lors du comptage des utilisateurs par covoiturage.', error: error.message });
    }
};


// Route pour récuperer tous les covoiturages d'un utilisateur spécifique par ID
export const getCovoiturageByUserId = async (req, res) => {
    const id  = validateId(req.params.id_utilisateur);

    try {
        const sql = 'SELECT * FROM covoiturage WHERE id_utilisateur = ?';
        const covoiturages = await query(sql, [id]);

        if (covoiturages.length === 0) {
            return res.status(404).json({ message: 'Aucun covoiturage trouvé pour cet utilisateur.' });
        }
        res.status(200).json(covoiturages);
    } catch (error) {
        console.error('Erreur lors de la récupération des covoiturages de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des covoiturages de l\'utilisateur.', error: error.message });
    }
};
