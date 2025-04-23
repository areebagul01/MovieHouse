import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './MovieDetails.module.css';

export default function MovieDetails({ movie, director, genre }) {
  const router = useRouter();

  if (router.isFallback) 
    return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{movie.title}</h1>
      <p className={styles.description}>{movie.description}</p>
      
      <div className={styles.detailsContainer}>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Release Year</div>
          <div className={styles.detailValue}>{movie.releaseYear}</div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Rating</div>
          <div className={styles.detailValue}>{movie.rating}/10</div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Genre</div>
          <div className={styles.detailValue}>{genre.name}</div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Director</div>
          <Link 
            href={`/movies/${movie.id}/director`} 
            className={styles.directorLink}
          >
            {director.name}
          </Link>
        </div>
      </div>

      <Link href="/movies" className={styles.backLink}>
        Back to Movies
      </Link>
    </div>
  );
}

export async function getStaticPaths() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);

  const paths = data.movies.map(movie => (
    { params: 
        { 
            id: movie.id 
        } 
    }
  ));

  return { 
    paths, 
    fallback: 'blocking' 
  };
}

export async function getStaticProps({ params }) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);

  const movie = data.movies.find(m => m.id === params.id);
  if (!movie) 
    return { 
        notFound: true 
    };

  const director = data.directors.find(d => d.id === movie.directorId);
  const genre = data.genres.find(g => g.id === movie.genreId);

  return { 
    props: { movie, director, genre }, 
    revalidate: 60 
  };
}