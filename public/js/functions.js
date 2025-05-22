// Fonction de conversion de la date au format français (JJ/MM/AAAA)
function convertToFrenchDate(isoDate) {
    const date = new Date(isoDate); // Crée un objet Date à partir de la chaîne ISO
    const day = String(date.getDate()).padStart(2, '0'); // Récupère le jour et le formate avec un zéro devant si nécessaire
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Récupère le mois (0-11) et ajoute 1, puis formate
    const year = date.getFullYear(); // Récupère l'année

    return `${day}/${month}/${year}`; // Retourne la date au format français
}

// Fonction pour mettre la première lettre en majuscule
function capitalizeFirstLetter(string) {
    if (!string) return string; // Vérifie si la chaîne est vide
    return string.charAt(0).toUpperCase() + string.slice(1);
}



