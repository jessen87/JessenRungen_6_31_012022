// Version 5.1 etape 5 : correction likes et dislikes

// schéma de données sauce

// import mongoose
const mongoose = require('mongoose');

// création d'un schéma de données qui contient les champs souhaités pour chaque sauce
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer :{ type: String, required: true },
  description: { type: String, required: true },
  mainPepper:{ type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number},
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: [{ type: String, required: true, default: [] }],
  usersDisliked: [{ type: String, required: true, default: [] }]
});


// export du schéma en tant que modèle Mongoose appelé « Sauce », le rendant disponible pour l'application Express
module.exports = mongoose.model('Sauce', sauceSchema);