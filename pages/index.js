import { useRouter } from 'next/router';
import Link from 'next/link';
import connectDB from '../lib/db';
import Movie from '../models/Movie';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
} from '@mui/material';

export default function Home({ trendingMovies }) {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Link href="/help/faqs" passHref legacyBehavior>
          <Button variant="outlined">Ask Questions</Button>
        </Link>
        <Link href="/help/contact" passHref legacyBehavior>
          <Button variant="outlined">Contact Us</Button>
        </Link>
        <Link href="/help/privacy" passHref legacyBehavior>
          <Button variant="outlined">Privacy Policy</Button>
        </Link>
      </Box>

      <Typography variant="h4" gutterBottom>
        Trending Movies
      </Typography>

      <Grid container spacing={3}>
        {trendingMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{movie.title}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {movie.description || 'No description available.'}
                </Typography>
              </CardContent>
              <CardActions>
                <Link href={`/movies/${movie._id}`} passHref legacyBehavior>
                  <Button size="small">View Details</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/genres')}
        >
          Browse Genres
        </Button>
      </Box>
    </Container>
  );
}

export async function getServerSideProps() {
  try {
    await connectDB();

    const movies = await Movie.find({})
      .sort({ rating: -1 })
      .limit(5)
      .lean();

    return {
      props: {
        trendingMovies: JSON.parse(JSON.stringify(movies)),
      },
    };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return {
      props: {
        trendingMovies: [],
      },
    };
  }
}
