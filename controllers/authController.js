import bcrypt from 'bcrypt';
import connection from '../db/db.js';
import { promisify } from 'util';
import { handleValidationErrors } from '../utils/validation.js'; 
import { SERVER_ERROR_MESSAGE } from '../utils/messages.js';



// Convertir les méthodes de connexion en Promises 
const query = promisify(connection.query).bind(connection); 


export const register = async (req, res) => {
    try {
        const { prenom, nom, email, password } = req.body;

        if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

        // Vérifier les erreurs de validation
        const errors = handleValidationErrors(req, res);    
        if (errors) {
            return res.status(400).json({ errors });
        }

        // Vérifier si l'utilisateur existe déjà
        const checkUserSql = 'SELECT * FROM utilisateur WHERE email = ?';
        const existingUser = await query(checkUserSql, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insérer le nouvel utilisateur
        const insertUserSql = 'INSERT INTO utilisateur (prenom, nom, password, email) VALUES (?, ?, ?, ?)';
        const result = await query(insertUserSql, [prenom, nom, hashedPassword, email]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Erreur lors de l\'enrégistrement.' });
        }

        res.status(201).json({message: 'Utilisateur enrégistré avec succés.' });

        } catch (err) {
            res.status(500).json({ message: SERVER_ERROR_MESSAGE });
        }
     
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis.' });

        const errors = handleValidationErrors(req, res);    // Vérifier les erreurs de validation
        if (errors) {
            return res.status(400).json({ errors });
        }

        // Vérifier si l'utilisateur existe déjà
        const checkUserSql = 'SELECT * FROM utilisateur WHERE email = ?';
        const existingUser = await query(checkUserSql, [email]);

        if (!existingUser) {
            return res.status(404).json({ message: 'Identifiants invalides.' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Authentification réussie
        req.session.userName = existingUser.nom;
        req.session.userRole = existingUser.role;
        req.session.userIsValid = existingUser.isValid;
        res.status(200).json({ message: 'Utilisateur connecté avec succès.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
