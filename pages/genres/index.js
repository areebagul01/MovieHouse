import Link from 'next/link';
import styles from './Genres.module.css';

export default function Genres({ genres }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Genres</h1>
      <ul className={styles.genresGrid}>
        {genres.map(genre => (
          <li key={genre.id} className={styles.genreCard}>
            <Link href={`/genres/${genre.id}`} className={styles.genreLink}>
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);

  return { 
    props: 
    { 
        genres: data.genres 
    } 
  };
}