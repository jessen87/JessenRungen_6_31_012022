// Version 5.1 etape 5 : correction likes et dislikes

// middelware pour importation des images (fichiers) gestion des fichiers entrants

// import du package multer
const multer = require('multer');

// liste des mine types extensions
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

// objet de configuration pour multer pour enregistrer les images sur le disque
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },
    filename: (req, file, callback) => {
    // génération d'un nouveau nom pour le fichier : nom d'origine auquel on rajoute des _ à la place des espaces + horodatage + minetype
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      // création du nom entier
      callback(null, name + Date.now() + '.' + extension);
    }
  });
  
  // export du middleware pour un fichier image unique
  module.exports = multer({storage: storage}).single('image');

