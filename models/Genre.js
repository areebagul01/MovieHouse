import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true }
}, { collection: 'genres' });

const Genre = mongoose.models.Genre || mongoose.model('Genre', genreSchema);
export default Genre;