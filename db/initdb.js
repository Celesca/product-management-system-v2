const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/productDB';

const connectDb = () => {
    mongoose.connect(url)
            .then(() => {
              console.log('Connected to MongoDB');
            })
              .catch((err) => {
              console.error('Error connecting to MongoDB:', err);
            });
};

module.exports = connectDb;