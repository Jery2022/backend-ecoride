
export const getStats = async (req, res) => {
    // données statistiques
    const stats = {
        totalPendingServices: 20, // Nombre total de services en attente
        totalCompletedServices: 80, // Nombre total de services terminés
        totalCancelledServices: 10, // Nombre total de services annulés
        totalActiveUsers: 120, // Nombre total d'utilisateurs actifs
        totalInactiveUsers: 30, // Nombre total d'utilisateurs inactifs
        totalActiveDrivers: 70, // Nombre total de conducteurs actifs
        totalInactiveDrivers: 20, // Nombre total de conducteurs inactifs
        totalActiveRides: 200, // Nombre total de trajets actifs
        totalInactiveRides: 50, // Nombre total de trajets inactifs
        totalReviews: 110,
    };

    const totalServices = stats.totalPendingServices + stats.totalCompletedServices + stats.totalCancelledServices; // Calcul du nombre total de services
    const totalUsers = stats.totalActiveUsers + stats.totalInactiveUsers; // Calcul du nombre total d'utilisateurs
    const totalDrivers = stats.totalActiveDrivers + stats.totalInactiveDrivers; // Calcul du nombre total de conducteurs
    const totalRides = stats.totalActiveRides + stats.totalInactiveRides; // Calcul du nombre total de trajets

    // Données pour le graphique
    // A remplacer par celles de votre base de données ou d'une API

    const statsChart = {
        ridesPerDay: [
            { date: '2023-10-01', count: 10, credit: 100 },
            { date: '2023-10-02', count: 15, credit: 150 },
            { date: '2023-10-03', count: 20, credit: 200 },
            { date: '2023-10-04', count: 25, credit: 250 },
            { date: '2023-10-05', count: 12, credit: 300 },
            { date: '2023-10-06', count: 17, credit: 350 },
            { date: '2023-10-07', count: 40, credit: 400 },
            { date: '2023-10-08', count: 35, credit: 450 },
            { date: '2023-10-09', count: 40, credit: 350 },
            { date: '2023-10-10', count: 55, credit: 550 },
            { date: '2023-10-11', count: 60, credit: 600 },
            { date: '2023-10-12', count: 65, credit: 650 },
            { date: '2023-10-13', count: 70, credit: 700 },
            { date: '2023-10-14', count: 75, credit: 750 },
            { date: '2023-10-15', count: 80, credit: 800 },
        ],
       
    };
    // Montant en crédit collecté
    const totalCredit = statsChart.ridesPerDay.reduce((acc, ride) => acc + ride.credit, 0); // Calcul du montant total en crédit collecté  
    

    const isAdmin = false // Remplacez par la logique de vérification du rôle de l'utilisateur

 //   const isAdmin = req.query.role === 'admin';  // Vérification si l'utilisateur est un administrateur
    res.json({ ...stats, totalServices, totalUsers, totalDrivers, totalRides, statsChart, totalCredit, isAdmin });
};