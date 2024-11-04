import mongoose from 'mongoose';

// Define a new Mongoose schema for the User model
const schema = new mongoose.Schema(
  {
    // Username field: must be a string, required, and trimmed of whitespace
    username: {
      type: String,
      required: true,
      trim: true
    },
    // Email field: must be a string, required, unique, and trimmed of whitespace
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    // Password field: must be a string and is required
    password: {
      type: String,
      required: true
    },
    // Token field: must be a string and is required
    token: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create and export the User model using the defined schema
export const User = mongoose.model('User', schema);
