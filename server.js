const express = require('express');
const mongoose = require('mongoose');
const app = express();

const dotenv = require('dotenv');
dotenv.config()
const port = process.env.NODE_LOCAL_PORT || 3000;

const connectDb = require('./db/initdb');

connectDb();

// สร้าง Schema และ Model



// Mock Data
async function mockData() {
  const products = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 1000, stock: 5},
    { id: 2, name: 'Typescript Fundamental', category: 'Books', price: 150, stock: 2},
    { id: 3, name: 'Clean code', category: 'Books', price: 1500, stock: 1}
  ]
  await Product.insertMany(products);
}

mockData();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`)
  next();
})







// PUT request
app.put('/products/:id', (req, res) => {
  const updateProduct = ProductRequestBody(req.body, res);
  Product.updateOne({_id: req.params.id,}, updateProduct, (err) => {
    if (err) {
      res.status(500).send({message: 'Server Error'});
    }
    else {
      res.status(200).send({message: 'Product updated'})
    }
  })
});

// DELETE request
app.delete('/products/:id', (req, res) => {
  const deletedProductID = parseInt(req.params.id);
  const productIndex = ValidateProductID(deletedProductID, res);
  products.splice(productIndex, 1);
  res.send({message: 'Product deleted'});
})

module.exports = app;