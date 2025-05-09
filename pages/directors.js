import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Alert,
  Link,
  Box
} from '@mui/material';
import useSWR from 'swr';
import NextLink from 'next/link';

const fetcher = url => fetch(url).then(res => res.json());

export default function Directors() {
  const { data, error, isLoading } = useSWR('/api/directors', fetcher);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Film Directors
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load directors data
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data?.map(director => (
            <Grid item xs={12} sm={6} md={4} key={director._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {director.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {director.biography}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Directed Movies:
                  </Typography>
                  
                  <Box component="ul" sx={{ 
                    pl: 2,
                    listStyle: 'none',
                    '& li': { mb: 0.5 }
                  }}>
                    {director.movies.map(movie => (
                      <li key={movie._id}>
                        <NextLink href={`/movies/${movie._id}`} passHref legacyBehavior>
                          <Link color="secondary" underline="hover">
                            {movie.title}
                          </Link>
                        </NextLink>
                      </li>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}