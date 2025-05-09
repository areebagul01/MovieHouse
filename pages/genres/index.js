// pages/genres/index.js
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

export default function Genres({ genres }) {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { data: movies, error, isLoading } = useSWR(
    selectedGenre ? `/api/genres/${selectedGenre}/movies` : null,
    fetcher
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        Browse Genres
      </Typography>

      {/* Genre Selection */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {genres.map(genre => (
          <Grid item key={genre._id}>
            <Button
              variant={selectedGenre === genre._id ? 'contained' : 'outlined'}
              onClick={() => setSelectedGenre(prev => 
                prev === genre._id ? null : genre._id
              )}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                px: 3,
                py: 1
              }}
            >
              {genre.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Movies Display */}
      {selectedGenre && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {genres.find(g => g._id === selectedGenre)?.name} Movies
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load movies
            </Alert>
          )}

          {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}

          <Grid container spacing={3}>
            {movies?.map(movie => (
              <Grid item xs={12} sm={6} md={4} key={movie._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {movie.title}
                    </Typography>
                    <Chip 
                      label={`⭐ ${movie.rating}`}
                      size="small"
                      sx={{ mb: 1.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Director: {movie.directorId?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1.5 }}>
                      {movie.description?.slice(0, 100)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

export async function getServerSideProps() {
  try {
    const { default: connectDB } = await import('../../lib/db');
    const { default: Genre } = await import('../../models/Genre');
    
    await connectDB();
    const genres = await Genre.find().select('name').lean();

    return {
      props: {
        genres: JSON.parse(JSON.stringify(genres))
      }
    };
  } catch (error) {
    console.error('Error fetching genres:', error);
    return {
      props: {
        genres: []
      }
    };
  }
}