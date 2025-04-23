import useSWR from 'swr';
import Link from 'next/link';
import styles from './Directors.module.css';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Directors() {
  const { data, error } = useSWR('/api/directors', fetcher);

  if (error) return <div>Failed to load directors</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Directors</h1>
      </header>
      
      <div className={styles.directorGrid}>
        {data.map(director => (
          <article key={director.id} className={styles.directorCard}>
            <h2 className={styles.directorName}>{director.name}</h2>
            <p className={styles.biography}>{director.biography}</p>
            
            <h3 className={styles.moviesHeader}>Movies Directed:</h3>
            <ul className={styles.movieList}>
              {director.movies.map(movie => (
                <li key={movie.id} className={styles.movieItem}>
                  <Link href={`/movies/${movie.id}`} className={styles.movieLink}>
                    {movie.title}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}