const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./db/initdb');
const mockData = require('./db/mockdata');
dotenv.config()

const app = express();

async function startServer() {
  try {
    await connectDb(); // Wait for the database connection to be established
    await mockData(); // After the database connection is established, insert mock data

    const port = process.env.NODE_LOCAL_PORT || 3000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/products', require('./routes/products'));

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;