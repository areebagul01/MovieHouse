import connectDB from '../../../lib/db';
import Movie from '../../../models/Movie';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  try {
    // Validate ID format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid movie ID format' });
    }

    const movie = await Movie.findById(id)
      .populate('directorId', 'name biography')
      .populate('genreId', 'name')
      .lean();  // Convert to plain JS object

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Verify population worked
    if (!movie.directorId || !movie.genreId) {
      console.warn('Population failed for:', id);
      return res.status(500).json({ error: 'Data consistency error' });
    }

    res.status(200).json({
      ...movie,
      director: movie.directorId,
      genre: movie.genreId
    });

  } catch (error) {
    console.error('API Error Details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch movie details',
      details: error.message 
    });
  }
}