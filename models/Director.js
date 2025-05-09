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

// Safe model registration pattern
let Director;
try {
  Director = mongoose.model('Director');
} catch {
  Director = mongoose.model('Director', directorSchema);
}

export default Director;