# Étape 1 : Image MySQL
FROM mysql:8.0.27 AS mysql

# Définir les variables d'environnement pour MySQL
ENV  MYSQL_DATABASE=ecoride_db  

# Use runtime environment variables or Docker secrets for sensitive data
# MYSQL_PASSWORD and MYSQL_ROOT_PASSWORD should be provided at runtime


# Exposer le port MySQL
EXPOSE 3306

# Étape 2 : Image Node.js
# FROM node:22.15.0-alpine3.21 AS node 

# Image de base Node.js
FROM node:22.15.0-alpine3.21 AS node

# Mettre à jour le système et installer les dépendances nécessaires
#RUN apk update && apk add --no-cache bash

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package*.json  ./

# Donner des autorisations à la nodel'utilisateur 
# RUN chown -R node:node node_modules

# Changer l'utilisateur pour éviter d'exécuter l'application en tant que root
# USER node


# Installer les dépendances en mode production
# RUN npm ci --production
# RUN npm install --production
RUN npm install 

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port de l'application Node.js
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["node", "server.js"] 