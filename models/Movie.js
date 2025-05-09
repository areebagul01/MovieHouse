// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  directorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Director',
    required: true 
  },
  genreId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Genre', 
    required: true },
  description: String,
  releaseYear: Number,
  rating: Number,
}, { collection: 'movies' });

module.exports = mongoose.models.Movie || mongoose.model('Movie', movieSchema);


