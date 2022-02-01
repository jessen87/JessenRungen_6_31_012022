// Version 5.1 etape 5 : correction likes et dislikes

// schéma de données user

// import mongoose
const mongoose = require('mongoose');

// rajout d'un package de validation pour prévalider les informations avant de les enregistrer
const uniqueValidator = require('mongoose-unique-validator');

// creation du schema de données utilisateur
const userSchema = mongoose.Schema({
    // rajout unique qui permet d'avoir une seule adresse email
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });

// application du validateur avant de faire le schema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
