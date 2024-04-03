const mongoose = require('mongoose');

const url = 'mongodb://mongo:27017/productDB';

const connectDb = () => {
    mongoose.connect(url, () => {
        console.log('Connected to MongoDB');
    }
)
};

module.exports = connectDb;