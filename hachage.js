import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement 

const saltRounds = 10;
const password = process.env.MDP_ADMIN;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
    } else {
        console.log('Mot de passe haché :', hash);
    }
});