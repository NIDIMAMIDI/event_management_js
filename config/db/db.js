import mongoose from 'mongoose';

// Connect to the MongoDB database
mongoose
  .connect(process.env.DATABASE) // Use the connection string from the environment variables
  .then(() => {
    // Log a success message if the connection is established
    console.log('Database has been connected successfully');
  })
  .catch((err) => {
    // Log the error message if the connection fails
    console.log(err.message);
  });
