// Import environment variables from the .env file
import 'dotenv/config';

// Import the database connection setup
import './config/db/db.js';

import express from 'express';
import indexRouter from './routes/index.routes.js';

// Initialize an Express application
const app = express();

// eslint-disable-next-line max-len
// Define the port on which the server will listen, defaulting to 3000 if not specified in environment variables
const port = process.env.PORT || 3005;

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use('/api', indexRouter);

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message to the console once the server has started
  console.log(`App has been started on port ${port}`);
});
