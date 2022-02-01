// Version 5.1 etape 5 : correction likes et dislikes

// logique métier des fonctions sauce

// import du schema de données sauce
const Sauce = require('../models/sauce');

// import du package filesystem
const fs = require('fs');
const { put } = require('../routes/sauce');
const sauce = require('../models/sauce');
//const sauce = require('../models/sauce');

// fonctions métiers pour les sauces
// on va exporter les différentes fonctions metiers 
// utilisation des methodes pour envoi et retour de la reponse au format json et de next pour renvoi à la prochaine fonction 

// création d'une sauce
exports.createSauce = (req, res, next) => {
    //  on recupere l'objet JSON de la requete
    const sauceObject = JSON.parse(req.body.sauce);
    // suppression du faux id
    delete sauceObject._id;
    // recupération de toutes les données
    const sauce = new Sauce({
      ...sauceObject,
      // recuperation de l'url de l'image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // enregistrement dans la base de données
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

// modification d'une sauce
exports.modifySauce =(req, res, next) => {
  // creation d'un objet pour voir si il y a ou pas une nouvelle image à la place de l'ancienne
  const sauceObject = req.file ?
  {
    // si il existe idem creation sauce
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // si il n'existe pas
  } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

// suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  // suppression du fichier image correspondant
  // recherche du fichier image correspondant
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    // suppression du fichier
    fs.unlink(`images/${filename}`, () => {
      // suppression de la sauce
      Sauce.deleteOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      });
  })
  .catch(error => res.status(500).json({ error }));
};

// renvoie une sauce
exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

// renvoie toutes les sauces
exports.getAllSauces =  (req, res, next) => {
    // renvoi un tableau contenant la totalité des objets sauce
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// gestion des likes sauce 
exports.likeDislike = (req, res, next) => {
  
  // on recupère le like dans le body
  const like = req.body.like;
  // on récupère l'ID de l'utilisateur
  const userId = req.body.userId;
  // on récupère l'ID de la sauce 
  const sauceId = req.params.id;

  // régles de gestion des likes ou dislikes
  // si like = 1,l'utilisateur aime la sauce 
  // si like  = 0,l'utilisateur annule son like ou son dislike
  // si like =-1, l'utilisateur n'aime pas la sauce, c'est un dislike,

  // L'identifiant de l'utilisateur doit être ajouté ou retiré du tableau approprié, 
  // en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois.
  // Nombre total de like et de dislike à mettre à jour avec chaque nouvelle notation

  // Gestion des régles
  try {
    // on recupère les données de la sauce
    Sauce.findOne({ _id:sauceId })
      .then(sauce => {
        console.log(like);

           // si c'est un like
          if (like === 1) { 

              //console.log('1');
              // on vérifie si l'utilisateur a déjà like  la sauce 
              const userLikedSauce = sauce.usersLiked.find((element) => element === userId) !== undefined;
              //console.log(userLikedSauce);
              if (userLikedSauce === false) {
                //console.log('user');   
                Sauce.updateOne(
                  {
                    _id: sauceId,
                  },
                  {
                    // mongo  ajoute une valeur spécifiée à un tableau
                    $push: {
                      usersLiked: userId,
                    },
                    // mongo  operator increments
                    $inc: {
                      // on incremente de 1
                      likes: +1,
                    },
                  }
                )
                .then(() => res.status(200).json({message: 'Like ajouté !'}))
                .catch((error) => res.status(400).json({error}))    
              }

          // si c'est un dislike
          } else if (like === -1) {
              //console.log('-1');
              // on vérifie si l'utilisateur a déjà dislike  la sauce 
              const userDislikedSauce = sauce.usersDisliked.find((element) => element === userId) !== undefined;
              //console.log(userLikedSauce);
              if (userDislikedSauce === false) {
                //console.log('user');   
                Sauce.updateOne(
                  {
                    _id: sauceId,
                  },
                  {
                    // mongo  ajoute une valeur spécifiée à un tableau
                    $push: {
                      usersDisliked: userId,
                    },
                    // mongo  operator increments
                    $inc: {
                      // on incremente de 1
                      dislikes: +1
                    },
                  }
                )
                .then(() => res.status(200).json({message: 'Dislike ajouté !'}))
                .catch((error) => res.status(400).json({error}))    
              }
          }
          // si on annule un like ou un dislike
          else if (like === 0) {
            // si on annule un like
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({
                  _id: sauceId
                }, {
                  // mongo  supprime une valeur spécifiée à un tableau
                  $pull: {
                    usersLiked: userId
                  },
                  // mongo  operator increments
                  $inc: {
                    // on desincremente de -1
                    likes: -1
                  }, 
                })
                .then(() => res.status(200).json({message: 'Like retiré !'}))
                .catch((error) => res.status(400).json({error}))

              }
              // si on annule un dislike
              if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne({
                    _id: sauceId
                  }, {
                    // mongo  supprime une valeur spécifiée à un tableau
                    $pull: {
                      usersDisliked: userId
                    },
                    // mongo  operator increments
                    $inc: {
                      // on desincremente de -1
                      likes: -1,
                    }, 
                  })
                  .then(() => res.status(200).json({message: 'Dislike retiré !'}))
                  .catch((error) => res.status(400).json({error}))
              }
          } else {
            throw new Error('Impossible de mettre à jour!');
          }


      })
      .catch(error => res.status(400).json({ error }));

  } catch (error) {
      error => res.status(500).json({ error });
  }

};
 


