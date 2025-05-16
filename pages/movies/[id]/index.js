import { 
  Container, 
  Typography, 
  Chip, 
  Button, 
  Box, 
  CircularProgress,
  Alert,
  Link
} from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import NextLink from 'next/link';

const fetcher = url => fetch(url).then(res => res.json());

export default function MovieDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: movie, error } = useSWR(id ? `/api/movies/${id}` : null, fetcher);

  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">
        Failed to load movie details. 
        <Button sx={{ ml: 2 }} onClick={() => router.reload()}>Retry</Button>
      </Alert>
    </Container>
  );

  if (!movie) return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <CircularProgress />
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button variant="outlined" onClick={() => router.back()}>
          Back to Movies
        </Button>
      </Box>

      <Typography variant="h3" gutterBottom>
        {movie.title}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip label={`⭐ ${movie.rating || 'N/A'}`} color="primary" />
        <Chip 
          label={`Year: ${movie.releaseYear || 'Unknown'}`} 
          variant="outlined" 
        />
        {movie.genre?.name && (
          <Chip 
            label={`Genre: ${movie.genre.name}`} 
            variant="outlined" 
          />
        )}
      </Box>

      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        {movie.description || 'No description available.'}
      </Typography>

      {movie.directorId?.name && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Director Information
          </Typography>
          <NextLink href={`/movies/${id}/director`} passHref legacyBehavior>
            <Link underline="hover">
              <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                🎬 {movie.directorId.name}
              </Typography>
            </Link>
          </NextLink>
        </Box>
      )}
    </Container>
  );
}