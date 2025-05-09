import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import connectDB from '../../../lib/db';
import Director from '../../../models/Director';
import Movie from '../../../models/Movie';

const fetcher = url => fetch(url).then(res => res.json());

export default function DirectorPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: director, error } = useSWR(
    id ? `/api/director/${id}` : null,
    fetcher
  );

  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">
        Failed to load director details
        <Button sx={{ ml: 2 }} onClick={() => router.reload()}>
          Retry
        </Button>
      </Alert>
    </Container>
  );

  if (!director) return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <CircularProgress size={60} />
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Back to Movie
      </Button>

      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        {director.name}
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        {director.biography}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Directed Movies
      </Typography>

      {director.movies?.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No movies found for this director
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {(director.movies || []).map(movie => (
            <Grid item xs={12} sm={6} md={4} key={movie._id}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Chip 
                    label={`⭐ ${movie.rating}`}
                    color="primary"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => router.push(`/movies/${movie._id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export async function getStaticPaths() {
  await connectDB();
  const movies = await Movie.find().select('directorId').lean();

  const paths = movies.map(movie => ({
    params: { id: movie._id.toString() }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  await connectDB();

  try {
    const movie = await Movie.findById(params.id)
      .populate('directorId')
      .lean();

    if (!movie?.directorId) {
      return { notFound: true };
    }

    const directorMovies = await Movie.find({ 
      directorId: movie.directorId._id 
    })
      .select('title rating _id')
      .lean();

    return {
      props: {
        director: {
          ...movie.directorId,
          _id: movie.directorId._id.toString(),
          movies: directorMovies.map(m => ({
            ...m,
            _id: m._id.toString()
          })) || []
        }
      },
      revalidate: 60
    };
  } catch (error) {
    return { notFound: true };
  }
}