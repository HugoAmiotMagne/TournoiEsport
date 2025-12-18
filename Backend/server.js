require('dotenv').config();

const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3002;

// Création du serveur
const server = http.createServer(app);

// Gestion des erreurs
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Le port ${PORT} nécessite des privilèges élevés`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Le port ${PORT} est déjà utilisé`);
      process.exit(1);
    default:
      throw error;
  }
});

// Quand le serveur démarre
server.on('listening', () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

// Démarrage
server.listen(PORT);
