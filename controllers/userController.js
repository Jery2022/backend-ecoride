import bcrypt from 'bcrypt';
import connection from '../db/db.js';

import { promisify } from 'util';
import { validateId, handleValidationErrors } from '../utils/validation.js';
import { 
        USER_ADDED_MESSAGE, 
        USER_NOT_FOUND_MESSAGE, 
        USER_UPDATED_MESSAGE,  
        USER_DELETED_MESSAGE, 
        NO_DATA_TO_UPDATE_MESSAGE,  
        SERVER_ERROR_MESSAGE } from '../utils/messages.js';

// Convertir les méthodes de connexion en Promises 
const query = promisify(connection.query).bind(connection);

export const addUser = async (req, res) => {
    const { nom, prenom, email, telephone, adresse, date_naissance, photo, password, pseudo, id_role } = req.body;

    // Vérifier les erreurs de validation
    const errors = handleValidationErrors(req, res);

    try {
        // Vérifier si l'utilisateur existe déjà
        const checkUserSql = 'SELECT * FROM utilisateur WHERE email = ?';
        const existingUser = await query(checkUserSql, [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        const fields = [];
        const values = [];
        const searchValues = [];

        if (nom) {
            fields.push('nom');
            searchValues.push('?');
            values.push(nom);
        }
        if (prenom) {
            fields.push('prenom');
            searchValues.push('?');
            values.push(prenom);
        }
        if (email) {
            fields.push('email');
            searchValues.push('?');
            values.push(email);
        }
        if (telephone) {
            fields.push('telephone');
            searchValues.push('?');
            values.push(telephone);
        }
        if (adresse) {
            fields.push('adresse');
            searchValues.push('?');
            values.push(adresse);
        }
        if (date_naissance) {
            fields.push('date_naissance');
            searchValues.push('?');
            values.push(date_naissance);
        }
        if (photo) {
            fields.push('photo');
            searchValues.push('?');
            values.push(photo);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
            fields.push('password');
            searchValues.push('?');
            values.push(hashedPassword);
        }
        if (pseudo) {
            fields.push('pseudo');
            searchValues.push('?');
            values.push(pseudo);
        }
        if (id_role) {
            // Vérifier si le rôle existe
            const roleExists = await query('SELECT 1 FROM role WHERE id_role = ?', [id_role]);
            if (roleExists.length === 0) {
                return res.status(400).json({ message: 'Le rôle spécifié n\'existe pas.' });
            }
            fields.push('id_role');
            searchValues.push('?');
            values.push(id_role);
        } else {
            // Utiliser la valeur par défaut si aucun rôle n'est fourni
            fields.push('id_role');
            searchValues.push('?');
            values.push(6); // Valeur par défaut
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à insérer.' });
        }

        // Insertion de l'utilisateur dans la base de données
        const sql = `INSERT INTO utilisateur (${fields.join(', ')}) VALUES (${searchValues.join(', ')})`;
        const result = await query(sql, values);
        res.status(201).json({ message: 'Utilisateur ajouté avec succès.', id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', err.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

// Lister tous les utilisateurs
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

// Récuperer un utilisateur par son ID
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

// Mettre à jour un utilisateur par son ID
export const updateUser = async (req, res) => {
    const id = validateId(req.params.id);
    const { nom, prenom, email, telephone, adresse, date_naissance, photo, password, pseudo, id_role, isValid } = req.body;

    handleValidationErrors(req, res);    // Vérifier les erreurs de validation

    const fields = [];
    const values = [];
    if (nom) {
        fields.push('nom = ?');
        values.push(nom);
    }
    if (prenom) {
        fields.push('prenom = ?');
        values.push(prenom);
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

    if (id_role) {
        fields.push('id_role = ?');
        values.push(id_role);
    }

    if (isValid) {
        fields.push('isValid = ?');
        values.push(isValid);
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

// Supprimer un utilisateur par son ID
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
