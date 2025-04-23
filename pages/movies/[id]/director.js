import Link from 'next/link';
import styles from './Director.module.css';

export default function Director({ director, moviesByDirector }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{director.name}</h1>
        <p className={styles.biography}>{director.biography}</p>
      </header>

      <section className={styles.moviesSection}>
        <h2 className={styles.sectionTitle}>Movies Directed</h2>
        <ul className={styles.moviesGrid}>
          {moviesByDirector.map(movie => (
            <li key={movie.id} className={styles.movieCard}>
              <Link href={`/movies/${movie.id}`} className={styles.movieLink}>
                {movie.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/directors" className={styles.backLink}>
        View All Directors
      </Link>

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
  const moviesByDirector = data.movies.filter(m => m.directorId === director.id);

  return { 
    props: 
    { 
      director, moviesByDirector 
    }, 
    revalidate: 60 
  };
}