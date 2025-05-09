import mongoose from 'mongoose';

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  biography: {
    type: String,
    required: true
  }
}, { collection: 'directors' });

// Prevent model overwrite in dev mode
const Director = mongoose.models.Director || mongoose.model('Director', directorSchema);
export default Director;