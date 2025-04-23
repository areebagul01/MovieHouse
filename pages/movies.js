import { useState } from 'react';
import Link from 'next/link';
import styles from './Movies.module.css';

export default function Movies({ movies, genres }) {
  const [selectedGenre, setSelectedGenre] = useState('');

  const filteredMovies = selectedGenre
    ? movies.filter(movie => movie.genreId === selectedGenre)
    : movies;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Movies</h1>
          <select 
            className={styles.genreSelect}
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.movieGrid}>
          {filteredMovies.map(movie => (
            <div key={movie.id} className={styles.movieCard}>
              <h2 className={styles.movieTitle}>{movie.title}</h2>
              <p className={styles.movieDescription}>{movie.description}</p>
              <Link href={`/movies/${movie.id}`} className={styles.detailsLink}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
}

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);

  return {
    props: { movies: data.movies, genres: data.genres },
    revalidate: 60,
  };
}