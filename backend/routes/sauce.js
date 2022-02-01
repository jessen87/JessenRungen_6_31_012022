// Version 5.1 etape 5 : correction likes et dislikes

// logique des routes sauce


// import application Epress pour créer un router
const express = require('express');
// import du controlleur métier des sauces
const sauceCtrl = require('../controllers/sauce');
// import du middelware de protection des routes authentification
const auth = require ('../middleware/auth');
// import du middelware de gestion de fichier
const multer = require ('../middleware/multer-config');

// création d'un routeur Express 
const router = express.Router();


// enregistrement des differentes routes en fonction des logiques métiers (création, suppresion, modification, ...) avec protection auth
// dans le router express avant enregistrament dans l'application

// route pour la creation d'une sauce incluant un fichier image
router.post('/', auth, multer, sauceCtrl.createSauce);

// route pour la modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// suppression d'une sauce avec l'id fourni
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// renvoie la sauce fourni avec l'id
router.get('/:id', auth, sauceCtrl.getOneSauce);

// renvoie sous forme de tableau la liste de tous les objets sauce de la base de données
router.get('/' + '', auth, sauceCtrl.getAllSauces);
  
// gestion des likes des sauces
router.post('/:id/like', auth, sauceCtrl.likeDislike);

// export du router
module.exports = router;