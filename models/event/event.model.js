import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // The title is required for each event
      trim: true, // Removes leading and trailing spaces
      lowercase: true, // Converts the title to lowercase
      unique: true // Ensures that the title is unique (no duplicate titles)
    },
    description: {
      type: String // An optional description for the event
    },
    date: {
      type: Date,
      required: true // Automatically sets the current date and time when the event is created
    },
    location: {
      type: String,
      trim: true,
      required: true // The location of the event is required
    },
    capacity: {
      type: Number,
      required: true // The capacity (max number of attendees) is required
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // References the User who created the event
      ref: 'User', // Points to the User collection
      required: true // The event must have a creator (User ID)
    }
  },
  {
    timestamps: true
  }
);

// Export the Event model for use in other parts of the application
export const Event = mongoose.model('Event', eventSchema);
