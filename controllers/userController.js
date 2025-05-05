import bcrypt from 'bcrypt';
import connection from '../db/db.js';
import { validationResult } from 'express-validator';
import { promisify } from 'util';

// Convertir les méthodes de connexion en Promises
const query = promisify(connection.query).bind(connection);

// Constantes pour les messages d'erreur
const INVALID_ID_MESSAGE = 'ID invalide.';
const SERVER_ERROR_MESSAGE = 'Erreur serveur.';
const USER_NOT_FOUND_MESSAGE = 'Utilisateur non trouvé.';
const USER_ADDED_MESSAGE = 'Utilisateur ajouté avec succès.';
const USER_UPDATED_MESSAGE = 'Utilisateur mis à jour avec succès.';
const USER_DELETED_MESSAGE = 'Utilisateur supprimé avec succès.';
const NO_DATA_TO_UPDATE_MESSAGE = 'Aucune donnée à mettre à jour.';

// Fonction utilitaire pour valider les IDs
const validateId = (id) => {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        throw new Error(INVALID_ID_MESSAGE);
    }
    return parsedId;
};

// Fonction utilitaire pour gérer les erreurs de validation
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

export const addUser = async (req, res) => {
    const { nom, prenom, email,  password } = req.body;

    handleValidationErrors(req, res);

    try {
        // Vérifier si l'utilisateur existe déjà
        const checkUserSql = 'SELECT * FROM utilisateur WHERE email = ?';
        const existingUser = await query(checkUserSql, [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion de l'utilisateur dans la base de données
        const sql = 'INSERT INTO utilisateur (nom, prenom, email,  password) VALUES (?, ?, ?, ?)';
        const result = await query(sql, [nom, prenom, email, hashedPassword]);
        res.status(201).json({ message: USER_ADDED_MESSAGE, id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

export const getAllUsers = async (req, res) => {
    const sql = 'SELECT * FROM utilisateur';
    try {
        const results = await query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

export const getUser = async (req, res) => {
    const id = validateId(req.params.id);

    const sql = 'SELECT * FROM utilisateur WHERE id_utilisateur = ?';
    try {
        const result = await query(sql, [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: USER_NOT_FOUND_MESSAGE });
        }
        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

export const updateUser = async (req, res) => {
    const id = validateId(req.params.id);
    const { nom, email, telephone, adresse, date_naissance, photo, password, pseudo, role } = req.body;

    handleValidationErrors(req, res);

    const fields = [];
    const values = [];
    if (nom) {
        fields.push('nom = ?');
        values.push(nom);
    }
    if (email) {
        fields.push('email = ?');
        values.push(email);
    }

    if (telephone) {
        fields.push('telephone = ?');
        values.push(telephone);
    }

    if (adresse) {
        fields.push('adresse = ?');
        values.push(adresse);
    }

    if (date_naissance) {
        fields.push('date_naissance = ?');
        values.push(date_naissance);
    }

    if (photo) {
        fields.push('photo = ?');
        values.push(photo);
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push('password = ?');
        values.push(hashedPassword);
    }

    if (pseudo) {
        fields.push('pseudo = ?');
        values.push(pseudo);
    }

    if (role) {
        fields.push('role = ?');
        values.push(role);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: NO_DATA_TO_UPDATE_MESSAGE });
    }

    const sql = `UPDATE utilisateur SET ${fields.join(', ')} WHERE id_utilisateur = ?`;
    values.push(id);

    try {
        const result = await query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: USER_NOT_FOUND_MESSAGE });
        }
        res.status(200).json({ message: USER_UPDATED_MESSAGE });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};

export const deleteUser = async (req, res) => {
    const id = validateId(req.params.id);

    const sql = 'DELETE FROM utilisateur WHERE id_utilisateur = ?';
    try {
        const result = await query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: USER_NOT_FOUND_MESSAGE }); 
        }
        res.status(200).json({ message: USER_DELETED_MESSAGE });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', err.message);
        res.status(500).json({ message: SERVER_ERROR_MESSAGE });
    }
};
