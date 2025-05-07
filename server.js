import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js'; 
import statsRouter from './routes/statsRoutes.js';
import bodyParser from 'body-parser';
//import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000; // Port par défaut pour le serveur

// Obtenir le répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares  
app.use(bodyParser.json()); // Pour parser les données JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour parser les données URL-encodées
app.use(express.static(path.join(__dirname, 'public'))); // Middleware pour servir les fichiers statiques


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
    const mimeType = getMimeType(filePath);
    res.sendFile(filePath, { headers: { 'Content-Type': mimeType } });
});
 
// Routes API utilisateurs
app.use('/api', userRouter); 

// Route API pour obtenir les statistiques
app.use('/api', statsRouter); 

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`); 
});
