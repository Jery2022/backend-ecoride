document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour charger la barre de navigation
    async function loadNavbar() {
        try {
            const response = await fetch('/partials/navbar.html');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement de la barre de navigation');
            }
            const dataNavbar = await response.text();
            document.getElementById('navbar-container').innerHTML = dataNavbar;
        } catch (error) {
            console.error('Erreur lors du chargement de la barre de navigation:', error);
        }
    }

    // Fonction pour charger le contenu des statistiques
    async function loadPageStats() {
        try {
            const response = await fetch('/partials/stats.html');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des statistiques');
            }
            const dataStats = await response.text();
            document.getElementById('main-container').innerHTML = dataStats;
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    }

    // Fonction pour charger les statistiques
    async function loadStats() {
        try {
            const response = await fetch('/api/stats');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des statistiques');
            }
            const stats = await response.json();

            // Mettre à jour le contenu HTML avec les statistiques
            document.getElementById('user-count').textContent = stats.totalUsers;
            document.getElementById('ride-count').textContent = stats.totalRides;
            document.getElementById('review-count').textContent = stats.totalReviews;

            if (stats.isAdmin) {
                document.getElementById('admin-stats').style.display = 'block';
                document.getElementById('credit-amount').textContent = stats.totalCredit;
            }
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    }

    // Charger la barre de navigation et les statistiques lorsque le DOM est prêt
    loadNavbar();
    loadPageStats();
    loadStats();
});