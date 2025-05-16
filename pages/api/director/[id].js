import connectDB from '../../../lib/db';
import Director from '../../../models/Director';
import Movie from '../../../models/Movie';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid director ID' });
    }

    const director = await Director.findById(id).lean();
    if (!director) return res.status(404).json({ error: 'Director not found' });

    const movies = await Movie.find({ directorId: id })
      .select('title rating _id')
      .lean();

    res.status(200).json({
      ...director,
      _id: id,
      movies: movies.map(movie => ({
        ...movie,
        _id: movie._id.toString()
      }))
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}