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
        loadStats(); // Charger les statistiques après le chargement du contenu
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

            if (stats.isAdmin) { // Vérification du rôle un admin
                document.getElementById('admin-stats').style.display = 'block';
                document.getElementById('credit-amount').textContent = stats.totalCredit;
            }

          //  console.log(stats.statsChart.ridesPerDay); // Afficher les statistiques dans la console pour le débogage

            // Préparation des données pour le graphique
            const ridesPerDay = stats.statsChart.ridesPerDay;
            ridesPerDay.forEach(ride => {
                console.log(`Date: ${ride.date}, Count: ${ride.count}`);
            });
         

           const labels = stats.statsChart.ridesPerDay.map(item => item.date);
           const dataRides = stats.statsChart.ridesPerDay.map(item => item.count);
           const dataCredit = stats.statsChart.ridesPerDay.map(item => item.credit);
           //const dataCredit = Array(labels.length).fill(stats.totalCredit);

            // Création du graphique
            const ctx = document.getElementById('statsChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Covoiturages par jour',
                            data: dataRides,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: false
                        },
                        {
                            label: 'Crédit total collecté',
                            data: dataCredit,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            fill: false,
                            hidden: !stats.isAdmin // Masquer si ce n'est pas un admin
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    }

    // Charger la barre de navigation et les statistiques lorsque le DOM est prêt
    loadNavbar();
    loadPageStats();
   
});




