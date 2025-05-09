// pages/api/genres/index.js
import connectDB from '../../../lib/db';
import Genre from '../../../models/Genre';

export default async function handler(req, res) {
  await connectDB();

  try {
    const genres = await Genre.find().select('name');
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
}