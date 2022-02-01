// Version 5.1 etape 5 : correction likes et dislikes

// middelware d'authentification appliquer avant les controleurs des routes

// import du package tokens d'authentification
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        // on récupère le token dans header d'authentification, puis split en 2 éléments sous forme de tableau
        // 1er élément Bearer et 2éme élément le token récupéré
        const token = req.headers.authorization.split(' ')[1];
        // decodage du token pour verification
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // récupération du user id
        const userId = decodedToken.userId;
        // on verifie le user id du corps de la requete avec le user id
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
          } else {
            next();
          } 
    } catch (error) {
        res.status(401).json({ error : error |'Requête non identifié'})
    }

};



