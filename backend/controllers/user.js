// Version 5.1 etape 5 : correction likes et dislikes

// logique métier des fonctions utilisateur

// import du schema de données utilisateur
const User = require('../models/user');

// import du package de cryptage
const bcrypt = require('bcrypt');

// import du package pour pouvoir créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');


// fonction sign up pour l'enregistrement de nouveau utilisateur
exports.signup = (req, res, next) => {
    // methode asynchrone de haschage du mot de passe, 10 tours
    bcrypt.hash(req.body.password,10)
        .then(hash => {
            const user = new User({
            // recuperation de l'email saisie
             email : req.body.email,
             // mot de passe hashé
             password : hash
            });
            // enregistrement de l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// fonction login pour connecter les utilisateurs existants
exports.login = (req, res, next) => {
    // recherche de l'utilisateur saisi
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error :'Utilisateur non trouvé !' });
        }
        // on compare le mot de passe envoyé avec la requête et le hash enregistré
        bcrypt.compare(req.body.password,user.password)
            .then(valid => {
                if (!valid){
                    return res.status(401).json({ error :'Mot de passe incorrect !' }); 
                }
                // renvoi l'id utilisateur et un TOKEN
                res.status(200).json({
                    userId : user._id,
                    // appel de la fonction sign du token d'authentification
                    token : jwt.sign(
                        // l'utilisateur
                        {userId : user._id},
                        // la chaine d'encodage
                        'RANDOM_TOKEN_SECRET',
                        // durée du token avant expiration
                        {expiresIn : '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};




