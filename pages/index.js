import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Home.module.css';

export default function Home({ trendingMovies }) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <Link href={`/help/faqs`} className={styles.navLink}>
          Ask Questions
        </Link>
        <Link href={`/help/contact`} className={styles.navLink}>
          Contact Us
        </Link>
        <Link href={`/help/privacy`} className={styles.navLink}>
          Privacy Policy
        </Link>
      </div>
      
      <div>
        <h1>Trending Movies</h1>
        <div className={styles.moviesContainer}>
          {trendingMovies.map(movie => (
            <div key={movie.id} className={styles.movieCard}>
              <h2 className={styles.movieTitle}>{movie.title}</h2>
              <p className={styles.movieDescription}>{movie.description}</p>
              <Link href={`/movies/${movie.id}`} className={styles.detailsLink}>
                View Details
              </Link>
            </div>
          ))}
        </div>
        <button 
          onClick={() => router.push('/genres')}
          className={styles.genreButton}
        >
          Browse Genres
        </button>
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

  const trendingMovies = data.movies.sort((a, b) => b.rating - a.rating).slice(0, 5);

  return {
    props: { trendingMovies },
    revalidate: 60,
  };
}