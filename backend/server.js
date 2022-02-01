// Version 1.0 etape 1 : démarrage du serveur backend

// Configuration du serveur Node

// import du package HTTP natif de Node 
const http = require('http');
// import de l'application Express
const app = require('./app');


// renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

  //  definition du port sur lequel l'application Express doit tourner
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);


// gestion des différentes erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

// fonction qui recoit la requête et la réponse
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// ecoute du serveur sur le port 
server.listen(process.env.PORT || 3000);

