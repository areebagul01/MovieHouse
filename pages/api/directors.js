import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);

  const directorsWithMovies = data.directors.map(director => ({
    ...director,
    movies: data.movies.filter(movie => movie.directorId === director.id),
  }));

  res.status(200).json(directorsWithMovies);
}