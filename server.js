import express from 'express';
import userRouter from './routes/userRoutes.js'; // Assurez-vous que le chemin est correct
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000; // Port par défaut pour le serveur

// Middlewares  
app.use(bodyParser.json({ type: 'application/json' })); // Pour parser les données JSON

app.use(bodyParser.urlencoded({ extended: true })); // Pour parser les données URL-encodées


app.use(express.json()); //Permettra de lire les données envoyées en JSON
 
app.get('/accueil', (req, res) => {
    res.send('Voici la page d\'accueil.');
});
 

app.use('/api',userRouter); // Utiliser le routeur d'utilisateurs



app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`); 
});