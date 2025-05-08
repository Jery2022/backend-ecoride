# Étape 1 : Image MySQL
FROM mysql:8.0.27 AS mysql

# Définir les variables d'environnement pour MySQL
ENV MYSQL_ROOT_PASSWORD=${DATABASE_PASSWORD} \
    MYSQL_DATABASE=${DATABASE_NAME} \
    MYSQL_USER=${DATABASE_USER} \
    MYSQL_PASSWORD=${DATABASE_PASSWORD} 

# Exposer le port MySQL
EXPOSE 3306

# Étape 2 : Image Node.js
FROM node:23.15.0-alpine AS node

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package.json package-lock.json ./

# Installer les dépendances en mode production
RUN npm ci --production

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port de l'application Node.js
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["node", "server.js"]