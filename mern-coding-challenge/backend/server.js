// Import required modules
const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const cors = require('cors'); // Import CORS middleware

// Import route files
const seedDataRoute = require('./routes/seedData'); // Route for seeding data
const transactionsRoute = require('./routes/transactions'); // Route for transactions
const chartsRoute = require('./routes/charts'); // Route for charts

// Create an Express application
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodnode server.jsies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transactions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected')) // Log success message
.catch(err => console.error('MongoDB connection error:', err)); // Log error message

// Define routes
app.use('/api', seedDataRoute); // Use seed data route
app.use('/api', transactionsRoute); // Use transactions route
app.use('/api', chartsRoute); // Use charts route

// Start the server
const PORT = process.env.PORT || 5000; // Set the port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log server start message
});
