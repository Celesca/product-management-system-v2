const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Product = require('../models/product');

const mongodb = MongoMemoryServer.create();

const connect = async () => {
    const uri = await (await mongodb).getUri();
    process.env.MONGO_URI = uri;
}

const insertData = async (data) => {
    await Product.insertMany(data);
}

const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await (await mongodb).stop();
}

const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

module.exports = { connect, closeDatabase, clearDatabase, insertData };