document.addEventListener('DOMContentLoaded', async function() {

    let isAdmin = false;
    let isEmploye = false;
    let userName = '';

    async function loadSession() {
        try {
            const response = await fetch('/api/session', { credentials: 'include' });
            
            if (response.ok) {
                const session = await response.json();

                isAdmin = session.isAdmin;
                isEmploye = session.isEmploye;
                userName = session.userName;
            } else {
                isAdmin = false;
                isEmploye = false;
                userName = '';
            }

        } catch (error) {
            isAdmin = false;
            isEmploye = false;
            userName = '';
        }

    }

    // Fonction pour charger la barre de navigation
    async function loadNavbar() {
        try {
            const response = await fetch('/partials/navbar.html');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement de la barre de navigation');
            }
            const dataNavbar = await response.text();
            document.getElementById('navbar-container').innerHTML = dataNavbar;
            
            // Evénement de déconnexion après le chargement de la navbar
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                    logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout(); 
                });
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la barre de navigation:', error);
        }

    }

    // Fonction pour afficher la section des statistiques
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

            if (response.status === 401) {
                alert("Vous devez être connecté pour accéder à cette page.");
                window.location.href = '/login/login.html';
                return;
            }

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des statistiques');
            }
            const stats = await response.json();

            // Mettre à jour le contenu HTML avec les statistiques
            document.getElementById('user-count').textContent = stats.totalUsers;
            document.getElementById('ride-count').textContent = stats.totalRides;
            document.getElementById('review-count').textContent = stats.totalReviews;

            if (isAdmin) { 
                // Vérification du rôle un administrateur
                document.getElementById('admin-stats').style.display = 'block';
                document.getElementById('stats-chart').style.display = 'block';
                document.getElementById('credit-amount').textContent = stats.totalCredit;
            }

           const labels = stats.statsChart.ridesPerDay.map(item => item.date);
           const dataRides = stats.statsChart.ridesPerDay.map(item => item.count);
           const dataCredit = stats.statsChart.ridesPerDay.map(item => item.credit);

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
                            hidden: isAdmin // Masquer si ce n'est pas un administrateur
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

    // Fonction de déconnexion côté frontend
    async function logout() {
        try {
             // Récupération du token CSRF
            let csrfToken = '';
            try {
                    const csrfRes = await fetch('/api/csrf-token', { credentials: 'include' });
                    const csrfData = await csrfRes.json();
                    csrfToken = csrfData.csrfToken;
                } catch (err) {
                    alert('Erreur CSRF, veuillez réessayer.');
                    return;
                }

            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'x-csrf-token': csrfToken
                }
            });
            if (response.ok) {
                window.location.href = '/login/login.html';
            }
        } catch (error) {
            alert('Erreur lors de la déconnexion');
        }
    }

    // Charge les données de session
    await loadSession();

    // Charge la barre de navigation et les statistiques lorsque le DOM est prêt
    loadNavbar();
    loadPageStats();
   
});




