import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js'; 
import statsRouter from './routes/statsRoutes.js';
import roleRouter from './routes/rolesRoutes.js';
import avisRouter from './routes/avisRoutes.js';
import marqueRouter from './routes/marquesRoutes.js'; 
import voitureRouter from './routes/voituresRoutes.js'; 
import configurationRouter from './routes/configurationRoutes.js';  
import parametreRouter from './routes/parametreRoutes.js'; 
import covoiturageRouter from './routes/covoiturageRoutes.js'; 
import participationRouter from './routes/participationRoutes.js'; 
import authRouter from './routes/authRoutes.js';  
import bodyParser from 'body-parser';
import  cookieParser from 'cookie-parser';
import session from 'express-session'; 
import csrf from 'csurf';
import cors from 'cors';
import dotenv from 'dotenv'; 

dotenv.config(); // Charger les variables d'environnement   



const csrfProtection = csrf(); // session uniquement
//const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour


const app = express();
const port = process.env.PORT || 4500; // Port par défaut pour le serveur

// Obtenir le répertoire courant
const __filename = fileURLToPath(import.meta.url);    
const __dirname = path.dirname(__filename);


// Middlewares  
app.use(bodyParser.json()); // Pour parser les données JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour parser les données URL-encodées
app.use(express.static(path.join(__dirname, 'public'))); // Middleware pour servir les fichiers statiques

app.use(cors({
    name : 'sessionId',
    origin:'localhost', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],  
   
}));

app.use(cookieParser(process.env.SECRET));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
})); 

app.use(csrf()); 


// Fonction pour déterminer le type MIME en fonction de l'extension
function getMimeType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
    };
    return mimeTypes[extname] || 'application/octet-stream'; // Type par défaut
}




// Route principale
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'layouts', 'main.html');
    const mimeType = getMimeType(filePath);
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } }); 
});

// Route pour servir les fichiers partiels
app.get('/partials/:file', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'partials', req.params.file);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Fichier non trouvé'); // Gérer les fichiers inexistants
    }
    const mimeType = getMimeType(filePath);
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } });
});

app.get('/roles/:file', (req, res) => {   
    const filePath = path.join(__dirname, 'views', 'roles', req.params.file); // Construire le chemin du fichier
    const mimeType = getMimeType(filePath); // Obtenir le type MIME
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } }); // Envoyer le fichier
});

app.get('/marques/:file', (req, res) => {   
    const filePath = path.join(__dirname, 'views', 'marques', req.params.file); // Construire le chemin du fichier
    const mimeType = getMimeType(filePath); // Obtenir le type MIME
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } }); // Envoyer le fichier
});

app.get('/voitures/:file', (req, res) => {   
    const filePath = path.join(__dirname, 'views', 'voitures', req.params.file); // Construire le chemin du fichier
    const mimeType = getMimeType(filePath); // Obtenir le type MIME
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } }); // Envoyer le fichier
});

app.get('/utilisateurs/:file', (req, res) => {   
    const filePath = path.join(__dirname, 'views', 'utilisateurs', req.params.file); // Construire le chemin du fichier
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Fichier non trouvé'); // Gérer les fichiers inexistants
    }
    const mimeType = getMimeType(filePath); // Obtenir le type MIME
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } }); // Envoyer le fichier
});

app.get('/covoiturages/:file', (req, res) => {   
    const filePath = path.join(__dirname, 'views', 'covoiturages', req.params.file); // Construire le chemin du fichier
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Fichier non trouvé'); // Gérer les fichiers inexistants 
    }
    const mimeType = getMimeType(filePath); // Obtenir le type MIME
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } }); // Envoyer le fichier
});

// Route pour afficher le formulaire d'inscription
app.get('/inscriptions/:file', (req, res) => {   
    const filePath = path.join(__dirname, 'views', 'inscriptions', req.params.file); // Construire le chemin du fichier
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Fichier non trouvé'); // Gérer les fichiers inexistants
    }
    const mimeType = getMimeType(filePath); // Obtenir le type MIME
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } }); // Envoyer le fichier
});

// Route pour afficher le formulaire de connexion (envoie juste le fichier HTML)
app.get('/login/:file', (req, res) => {   
    const filePath = path.join(__dirname, 'views', 'login', req.params.file);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Fichier non trouvé');
    }
    const mimeType = getMimeType(filePath);
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } });  
});



/*
app.get('/users/:file', (req, res) => {   
    const filePath = path.join(__dirname, 'views', 'users', req.params.file); // Construire le chemin du fichier
    const mimeType = getMimeType(filePath); // Obtenir le type MIME
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } }); // Envoyer le fichier
});
*/

// Route API pour fournir le token CSRF au frontend
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() }); 
});


// Routes API pour s'enrégister et se connecter  
app.use('/api', authRouter); 

// Route API pour obtenir les statistiques 
app.use('/api', statsRouter); 
  
// Routes API pour gerer les utilisateurs
app.use('/api', csrfProtection, userRouter);   
 
// Routes API pour gerer roles
app.use('/api', roleRouter);

// Routes API pour gerer les avis
app.use('/api', avisRouter);

// Routes API pour gerer les marques
app.use('/api', marqueRouter);

// Routes API pour gerer les voitures
app.use('/api', voitureRouter);

// Routes API pour gerer les configurations
app.use('/api', configurationRouter);

// Routes API pour gerer les parametres
app.use('/api', parametreRouter);

// Routes API pour gerer les covoiturages
app.use('/api', covoiturageRouter); 

// Routes API pour gérer les participations aux covoiturages
app.use('/api', participationRouter);



/*
// Middleware pour gérer les erreurs 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'partials', '404.html')); // Envoyer la page 404
});
*/

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`); 
});
