const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./db/initdb');
const mockData = require('./db/mockdata');
dotenv.config()

const app = express();

connectDb();
const port = process.env.NODE_LOCAL_PORT || 3000;
mockData();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', require('./routes/products'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;