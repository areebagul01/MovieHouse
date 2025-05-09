require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Genre = require('../models/Genre').default;
const Director = require('../models/Director').default;
const fs = require('fs');
const path = require('path');

// Temporary debug
console.log('Raw URI:', process.env.MONGODB_URI);
const cleanURI = process.env.MONGODB_URI?.replace(/^MONGODB_URI=/, '');
console.log('Clean URI:', cleanURI);

async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(cleanURI);

    console.log('Clearing existing data...');
    await Movie.deleteMany();
    await Genre.deleteMany();
    await Director.deleteMany();

    // Load JSON data
    const filePath = path.join(process.cwd(), 'data', 'movies.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Create ID mapping
    const genreMap = new Map();
    const directorMap = new Map();

    // Insert Genres
    for (const genre of data.genres) {
      const newGenre = await Genre.create({ _id: new mongoose.Types.ObjectId(), name: genre.name });
      genreMap.set(genre.id, newGenre._id);
    }

    // Insert Directors
    for (const director of data.directors) {
      const newDirector = await Director.create({ 
        _id: new mongoose.Types.ObjectId(),
        name: director.name,
        biography: director.biography
      });
      directorMap.set(director.id, newDirector._id);
    }

    // Insert Movies
    for (const movie of data.movies) {
      await Movie.create({
        _id: new mongoose.Types.ObjectId(),
        title: movie.title,
        directorId: directorMap.get(movie.directorId),
        genreId: genreMap.get(movie.genreId),
        description: movie.description,
        releaseYear: movie.releaseYear,
        rating: movie.rating
      });
    }

    console.log('Data import successful!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();