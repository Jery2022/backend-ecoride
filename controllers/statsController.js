
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
        totalCredit: 5000, // Montant en crédit collecté
    };

    const totalServices = stats.totalPendingServices + stats.totalCompletedServices + stats.totalCancelledServices; // Calcul du nombre total de services
    const totalUsers = stats.totalActiveUsers + stats.totalInactiveUsers; // Calcul du nombre total d'utilisateurs
    const totalDrivers = stats.totalActiveDrivers + stats.totalInactiveDrivers; // Calcul du nombre total de conducteurs
    const totalRides = stats.totalActiveRides + stats.totalInactiveRides; // Calcul du nombre total de trajets


    const isAdmin = req.query.role === 'admin';  // Vérification si l'utilisateur est un administrateur
    res.json({ ...stats, totalServices, totalUsers, totalDrivers, totalRides, isAdmin });
};