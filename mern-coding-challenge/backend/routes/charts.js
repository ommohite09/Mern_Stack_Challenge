// Import required modules
const express = require('express');                       // Import Express framework
const router = express.Router();                          // Create a new router object
const Transaction = require('../models/Transaction');    // Import the Transaction model

// Bar Chart API - Group transactions by price range
router.get('/price-range', async (req, res) => {
  try {
    const { month } = req.query; // Extract the month parameter from the query
    const start = new Date(`${month}-01`); // Start date (e.g., 'March-01')
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // End date (last day of the month)

    // Perform aggregation to group transactions by price ranges
    const priceRanges = await Transaction.aggregate([
      {
        $match: { 
          dateOfSale: { $gte: start, $lt: end } // Filter transactions by date range
        }
      },
      {
        $bucket: {
          groupBy: "$price", // Group by the price field
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity], // Define price boundaries
          default: "Other", // Group transactions not fitting into boundaries
          output: { count: { $sum: 1 } } // Count the number of transactions in each range
        }
      }
    ]);

    // Send the aggregated data as a JSON response
    res.json(priceRanges);
  } catch (error) {
    // Handle any errors and respond with a 500 status code
    res.status(500).send('Error fetching price range data');
  }
});

// Pie Chart API - Group transactions by category
router.get('/categories', async (req, res) => {
  try {
    const { month } = req.query; // Extract the month parameter from the query
    const start = new Date(`${month}-01`); // Start date (e.g., 'March-01')
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // End date (last day of the month)

    // Perform aggregation to group transactions by category
    const categories = await Transaction.aggregate([
      {
        $match: { 
          dateOfSale: { $gte: start, $lt: end } // Filter transactions by date range
        }
      },
      {
        $group: {
          _id: "$category",  // Group by the category field
          count: { $sum: 1 } // Count the number of transactions in each category
        }
      }
    ]);

    // Send the grouped data as a JSON response
    res.json(categories);
  } catch (error) {
    // Handle any errors and respond with a 500 status code
    res.status(500).send('Error fetching category data');
  }
});

// Export the router for use in server.js
module.exports = router; 
