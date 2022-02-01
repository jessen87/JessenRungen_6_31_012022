// Version 5.1 etape 5 : correction likes et dislikes

// Application framework Express

// import application Epress 
const express = require('express');
// import pour connection à la base de données Mongoose
const mongoose = require('mongoose');
// import des routers
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
// creation du path serveur
const path = require('path');

// application express
const app = express();
// recupere toutes les requêtes application/json (pas besoin d'utiliser bodyparse pour json car inclut dans express) 
// et met à disposition leur body sur l'objet req
app.use(express.json());


// connection à la base de données Mongoose et gestion de la connection
mongoose.connect('mongodb+srv://Jess:Spartacus131187@cluster0.kmwba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// gestion des erreurs CORS qui bloque les appels HTTP entre des serveurs différent
app.use((req, res, next) => {
  // accés à l'API depuis n'importe quelle origine 
  res.setHeader('Access-Control-Allow-Origin', '*');
  // ajout des headers mentionnés aux requêtes envoyées vers l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // envoie des requêtes avec les différentes méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// traitement de la route vers le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));


// enregistrement des routers
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

 // export de l'application
 module.exports = app;