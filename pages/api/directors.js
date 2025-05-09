import connectDB from '../../lib/db';
import Director from '../../models/Director';
import Movie from '../../models/Movie';

export default async function handler(req, res) {
  await connectDB();

  try {
    const directors = await Director.aggregate([
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: 'directorId',
          as: 'movies',
          pipeline: [{
            $project: { title: 1, _id: 1 }
          }]
        }
      },
      {
        $project: {
          name: 1,
          biography: 1,
          movies: 1
        }
      }
    ]);

    res.status(200).json(directors);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch directors' });
  }
}