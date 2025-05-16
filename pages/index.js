import { useRouter } from 'next/router';
import Link from 'next/link';
import connectDB from '../lib/db';
import Movie from '../models/Movie';
import { useTheme } from '../context/ThemeContext';
import ThemeToggleButton from '../components/ThemeToggleButton';
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
  const { isDark } = useTheme();

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: 4,
        bgcolor: isDark ? 'background.default' : 'background.paper',
        minHeight: '100vh',
        p: 3,
        transition: 'background-color 0.3s ease'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 4,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
        <ThemeToggleButton />
      </Box>

      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
        Trending Movies
      </Typography>

      <Grid container spacing={3}>
        {trendingMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>
                  {movie.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1,
                    color: 'text.secondary',
                    height: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {movie.description || 'No description available.'}
                </Typography>
              </CardContent>
              <CardActions>
                <Link href={`/movies/${movie._id}`} passHref legacyBehavior>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        mt: 4, 
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        gap: 2
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/genres')}
        >
          Browse Genres
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/directors')}
        >
          View All Directors
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