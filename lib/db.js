import mongoose from 'mongoose';
import '../models/Movie';
import '../models/Director';  // Add this
import '../models/Genre';     // Add this

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('MONGODB_URI missing in .env.local');

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(mongoose => {
      console.log('MongoDB Connected');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;