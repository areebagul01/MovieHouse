// pages/api/genres/[id]/movies.js
import connectDB from '../../../../lib/db';
import Movie from '../../../../models/Movie';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  try {
    const movies = await Movie.find({ genreId: id })
      .populate('directorId', 'name')
      .select('title description rating directorId');
      
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
}